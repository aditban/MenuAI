# MenuAI - Restaurant Menu Decoder

A web application that uses OpenAI Vision API to decode complex restaurant menu dishes into simple English descriptions.

## Features

- 📸 **Image Upload**: Upload up to 5 restaurant menu photos
- 🤖 **AI-Powered Analysis**: Uses OpenAI's vision capabilities to extract dish information
- 🌍 **Multi-Language Support**: Translates dishes from any language to English
- 📊 **Nutritional Insights**: Estimates calories, sugar, fat, and greens content
- 📱 **Responsive Design**: Works perfectly on mobile and desktop
- 🎨 **Beautiful UI**: Clean, modern interface designed in Figma

## How It Works

1. **Upload Menu Photos** - Click the menu interface to select restaurant menu images
2. **AI Processing** - OpenAI analyzes each image to extract dish names
3. **Simple Descriptions** - Get 20-word maximum descriptions with main ingredients
4. **Nutritional Analysis** - See estimated nutritional content for each dish

## Backend Implementation ✅

### 🚀 Production-Ready Solution

This application now includes a complete Node.js backend that handles OpenAI API calls, solving all CORS issues and providing a production-ready solution.

### Quick Start

**Option 1: Easy Setup (Recommended)**
```bash
# Make the startup script executable
chmod +x start.sh

# Run the complete setup and server
./start.sh
```

**Option 2: Manual Setup**
```bash
# Install dependencies
npm install

# Start the backend server
npm start
```

The server will start on `http://localhost:3000` and serve both the API and frontend.

## Files Structure

### Frontend
- `index.html` - Main upload interface
- `results.html` - Results display page
- `styles.css` - Styling for main interface
- `results-styles.css` - Styling for results page
- `demo.html` - Demo page redirector

### Backend
- `server.js` - Express server with OpenAI integration
- `package.json` - Node.js dependencies and scripts
- `start.sh` - Easy setup and startup script
- `env.example` - Environment variables template

### Backend API Endpoints

- `GET /api/health` - Server health check
- `POST /api/analyze-menu` - Process menu images with OpenAI
- `GET /*` - Serve frontend static files

## OpenAI Integration

The system uses the following prompt to analyze menu images:

```
Analyze this restaurant menu image and extract all dish names. For each dish, provide:
1. The original dish name (as it appears in the menu)
2. A simple English description (maximum 20 words) explaining what the dish is and its main ingredients
3. Estimate nutritional information (High/Medium/Low for: Calories, Sugar, Fat, Greens)

Format your response as a JSON array...
```

## Testing

### 1. Test Backend Server
```bash
# Start the server
npm start

# Test health endpoint
curl http://localhost:3000/api/health

# Test OpenAI integration
curl http://localhost:3000/api/test-openai
```

### 2. Test Full Application
```bash
# Open the frontend
open http://localhost:3000/index.html

# Or visit in browser:
# http://localhost:3000
```

### 3. Demo Mode (No Backend Required)
```bash
# View demo with sample data
open demo.html
# Or visit: http://localhost:3000/demo.html
```

### How to Test Menu Processing
1. Start backend server (`npm start`)
2. Open `http://localhost:3000` in browser
3. Click menu image to upload restaurant menu photos
4. Click "Proceed" - images will be sent to backend
5. Backend processes images with OpenAI Vision API
6. View decoded dishes with descriptions and nutrition info

## Production Deployment

For production use, implement a backend API that:
1. Receives uploaded images from frontend
2. Processes images with OpenAI Vision API
3. Returns structured results to frontend
4. Handles error cases and rate limiting

## Design Credits

UI/UX designed in Figma with:
- Clean, modern interface
- Responsive mobile-first design  
- Beautiful gradient backgrounds
- Intuitive user flow
- Professional typography (Instrument Serif, Ropa Sans) 