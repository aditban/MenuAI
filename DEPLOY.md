# 🚀 MenuAI Deployment Guide

Your MenuAI application is **ready for deployment**! All files are committed to Git and the project is configured for Vercel.

## Step 1: Create GitHub Repository

1. **Go to GitHub:** Visit [github.com](https://github.com) and sign in
2. **Create Repository:** Click the **"New"** button (green button)
3. **Repository Details:**
   - **Repository Name:** `MenuAI` (or any name you prefer)
   - **Visibility:** Keep it **Public** (free)
   - **DO NOT** check "Add a README file" (we already have one)
   - **DO NOT** add .gitignore or license (already included)
4. **Click "Create repository"**

## Step 2: Push Your Code to GitHub

Copy your repository URL from GitHub (it will look like: `https://github.com/YOUR_USERNAME/MenuAI.git`)

Then run these commands in your terminal:

```bash
# Connect to your GitHub repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/MenuAI.git

# Push your code
git push -u origin main
```

## Step 3: Deploy to Vercel

1. **Visit Vercel:** Go to [vercel.com](https://vercel.com)
2. **Sign Up:** Click **"Sign up"** and choose **"Continue with GitHub"**
3. **Import Project:** Click **"New Project"**
4. **Select Repository:** Find and import your **MenuAI** repository
5. **Configure Project:**
   - **Framework Preset:** Vercel should auto-detect (leave as is)
   - **Root Directory:** Leave as `./` (default)
   - **Build Command:** Leave as default
   - **Output Directory:** Leave as default

## Step 4: Add Environment Variable (CRITICAL!)

Before deploying, you MUST add your OpenAI API key:

1. **In Vercel deployment screen**, find **"Environment Variables"** section
2. **Add Variable:**
   - **Name:** `OPENAI_API_KEY`
   - **Value:** `sk-...` (your complete OpenAI API key)
   - **Environment:** All environments (Development, Preview, Production)
3. **Click "Add"**

## Step 5: Deploy!

1. **Click "Deploy"** button
2. **Wait 2-3 minutes** for deployment to complete
3. **Get your live URL:** `https://menuai-[random].vercel.app`

## 🎉 You're Live!

Your MenuAI application will be live and shareable worldwide!

## Troubleshooting

**If deployment fails:**
1. Check that `OPENAI_API_KEY` environment variable is set correctly
2. Verify your OpenAI API key is valid and has credits
3. Check Vercel build logs for specific errors

**Need help?** The project is fully configured and should work immediately with Vercel.

---

## What's Included in This Deployment:

✅ **Frontend:** Beautiful, responsive UI matching your Figma design
✅ **Backend:** Node.js Express server with OpenAI integration  
✅ **Menu Validation:** AI-powered menu image detection
✅ **Error Handling:** Comprehensive error screens
✅ **Image Processing:** Support for up to 5 menu images
✅ **Dish Analysis:** OpenAI Vision API for dish extraction
✅ **Nutrition Info:** Calorie, sugar, and fat analysis
✅ **Search Integration:** Google Images and pronunciation search
✅ **Mobile Responsive:** Works perfectly on all devices

Ready to launch! 🚀
