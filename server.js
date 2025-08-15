const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable is required');
    console.error('Please set it in your deployment platform (Vercel, Railway, etc.)');
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? true  // Allow all origins in production
        : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8080', 'file://'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files are now served directly by Vercel from /public directory

// Configure multer for handling file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'MenuAI Backend Server is running' });
});

// Debug endpoint to check file availability
app.get('/api/debug/files', (req, res) => {
    const fs = require('fs');
    const criticalFiles = [
        'styles.css',
        'results-styles.css', 
        'sad-gif.gif',
        'SPEAK.png',
        'Camera-button.png',
        'back-arrow.svg',
        'bd1b62afae645bcedafd9001263b3c87dce15772.png',
        '6dda884d01f5eb17201b2606849277e69541e05c.png'
    ];
    
    const fileStatus = {};
    criticalFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        fileStatus[file] = {
            exists: fs.existsSync(filePath),
            path: filePath,
            __dirname: __dirname
        };
    });
    
    res.json({
        working_directory: __dirname,
        file_status: fileStatus
    });
});

// Test OpenAI integration with a simple prompt
app.get('/api/test-openai', async (req, res) => {
    try {
        console.log('Testing OpenAI integration...');
        
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: "Return a simple JSON object with the message 'OpenAI integration working' and status 'success'. Return ONLY the JSON, no markdown formatting."
                }
            ],
            max_tokens: 100,
            temperature: 0.1
        });

        const content = response.choices[0].message.content.trim();
        console.log('OpenAI test response:', content);
        
        // Try to parse as JSON
        try {
            const parsed = JSON.parse(content);
            res.json({ 
                success: true, 
                openai_response: parsed,
                raw_response: content,
                message: 'OpenAI integration is working correctly!'
            });
        } catch (parseError) {
            res.json({ 
                success: false, 
                error: 'OpenAI responded but with invalid JSON',
                raw_response: content,
                parse_error: parseError.message
            });
        }
        
    } catch (error) {
        console.error('OpenAI test error:', error);
        res.status(500).json({ 
            success: false,
            error: 'OpenAI integration failed',
            details: error.message 
        });
    }
});

// Process menu images endpoint
app.post('/api/analyze-menu', async (req, res) => {
    try {
        const { images } = req.body;
        
        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ 
                error: 'No images provided. Please upload at least one menu image.' 
            });
        }

        if (images.length > 5) {
            return res.status(400).json({ 
                error: 'Too many images. Maximum 5 images allowed.' 
            });
        }

        console.log(`Processing ${images.length} menu images...`);
        
        // First, validate if the images are actually restaurant menus
        console.log('Validating if images contain restaurant menus...');
        const areMenuImages = await validateMenuImages(images);
        
        if (!areMenuImages) {
            console.log('Images do not appear to be restaurant menus');
            return res.status(400).json({ 
                error: 'NOT_MENU_IMAGES',
                message: 'The uploaded images do not appear to be restaurant menus. Please upload images of restaurant menus.' 
            });
        }
        
        console.log('Images validated as restaurant menus, proceeding with analysis...');
        const allDishes = [];
        
        // Process each image
        for (let i = 0; i < images.length; i++) {
            const imageData = images[i];
            console.log(`Analyzing image ${i + 1}/${images.length}...`);
            
            try {
                const dishes = await extractDishesFromImage(imageData);
                allDishes.push(...dishes);
                console.log(`Found ${dishes.length} dishes in image ${i + 1}`);
            } catch (error) {
                console.error(`Error processing image ${i + 1}:`, error.message);
                // Continue with other images even if one fails
            }
        }

        if (allDishes.length === 0) {
            return res.status(422).json({ 
                error: 'No dishes could be extracted from the provided images. Please ensure the images contain readable menu text.' 
            });
        }

        console.log(`Successfully extracted ${allDishes.length} total dishes`);
        res.json({ dishes: allDishes });
        
    } catch (error) {
        console.error('Error in /api/analyze-menu:', error);
        res.status(500).json({ 
            error: 'Internal server error while processing menu images.',
            details: error.message 
        });
    }
});

// Function to validate if images are restaurant menus
async function validateMenuImages(images) {
    try {
        // Check each image to see if at least one is a restaurant menu
        for (let i = 0; i < images.length; i++) {
            const imageData = images[i];
            
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `Look at this image and determine if it's a restaurant menu or contains restaurant menu content.

A restaurant menu should have:
- Food/drink items with names
- Prices (optional)
- Categories like appetizers, mains, desserts, beverages
- Restaurant branding/name (optional)

Answer with only one word: "YES" if this appears to be a restaurant menu, or "NO" if it's not a restaurant menu.`
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: imageData
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 10,
                temperature: 0
            });

            const answer = response.choices[0]?.message?.content?.trim().toLowerCase();
            
            // If at least one image is a menu, return true
            if (answer === 'yes') {
                return true;
            }
        }
        
        // If none of the images are menus, return false
        return false;
        
    } catch (error) {
        console.error('Error validating menu images:', error);
        // If validation fails, assume it's a menu to avoid false negatives
        return true;
    }
}

// Function to extract dishes from a single image using OpenAI Vision
async function extractDishesFromImage(imageData) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Analyze this restaurant menu image and extract all dish names. For each dish, provide:
1. The original dish name (as it appears in the menu)
2. A structured description in this EXACT format: "This is a [dish type]. [2-line description of the dish]. Top ingredients: [main ingredients]"
   - [dish type] should be 1-2 words like: pasta, pizza, salad, soup, steak, cake, ice cream, appetizer, etc.
   - [2-line description] should be 2 sentences explaining what the dish is
   - [main ingredients] should list 3-5 key ingredients
3. Estimate nutritional information (High/Medium/Low for: Calories, Sugar, Unhealthy Fat)

IMPORTANT: Return ONLY valid JSON format. Do not include any text before or after the JSON.

Format your response as a JSON array like this:
[
  {
    "original_name": "Original dish name",
    "simple_description": "This is a pasta. Creamy white sauce pasta with garlic and herbs. Classic Italian comfort food. Top ingredients: pasta, cream, garlic, parmesan, herbs",
    "nutrition": {
      "calories": "High",
      "sugar": "Low", 
      "unhealthy_fat": "Medium"
    }
  }
]

Focus on dishes that are clearly visible and readable. If text is in another language, translate it to English. If you cannot find any clear dishes, return an empty array []`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageData
                            }
                        }
                    ]
                }
            ],
            max_tokens: 2000,
            temperature: 0.1
        });

        let content = response.choices[0].message.content.trim();
        console.log('OpenAI response:', content);

        // Remove markdown code blocks if present
        if (content.startsWith('```json')) {
            content = content.replace(/```json\s*/, '').replace(/\s*```$/, '');
        } else if (content.startsWith('```')) {
            content = content.replace(/```\s*/, '').replace(/\s*```$/, '');
        }

        console.log('Cleaned content for parsing:', content);

        try {
            // Try to parse the JSON response
            const dishes = JSON.parse(content);
            
            // Validate the response format
            if (!Array.isArray(dishes)) {
                throw new Error('Response is not an array');
            }

            // Filter and validate each dish
            const validDishes = dishes.filter(dish => {
                return dish && 
                       typeof dish.original_name === 'string' && 
                       typeof dish.simple_description === 'string' &&
                       dish.nutrition &&
                       typeof dish.nutrition === 'object';
            });

            return validDishes;

        } catch (parseError) {
            console.error('Failed to parse OpenAI response as JSON:', parseError.message);
            console.error('Raw response:', content);
            
            // Fallback: return a default dish if parsing fails
            return [{
                original_name: "Menu Item",
                simple_description: "Unable to extract dish details from this image section",
                nutrition: {
                    calories: "Medium",
                    sugar: "Low",
                    fat: "Medium",
                    greens: "Low"
                }
            }];
        }
        
    } catch (error) {
        console.error('OpenAI API error:', error.message);
        throw new Error(`OpenAI processing failed: ${error.message}`);
    }
}

// All static files and HTML pages are served directly by Vercel from /public
// Only API routes are handled by this Node.js function

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 MenuAI Backend Server running on port ${PORT}`);
    console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🖼️  Menu analysis: POST http://localhost:${PORT}/api/analyze-menu`);
    console.log(`🌐 Frontend: http://localhost:${PORT}/index.html`);
});

module.exports = app; 