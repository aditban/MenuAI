#!/bin/bash

echo "🚀 Starting MenuAI Backend Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16+) first:"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check if .env file exists, if not create from template
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        echo "📝 Creating .env file from template..."
        cp env.example .env
        echo "⚠️  Please edit .env file and add your OpenAI API key"
        echo "   The API key is already included in the code for testing"
    fi
fi

echo ""
echo "🌟 MenuAI Backend Server Starting..."
echo "📍 Server will be available at: http://localhost:3000"
echo "📱 Frontend will be available at: http://localhost:3000/index.html"
echo "🔍 API Health Check: http://localhost:3000/api/health"
echo ""

# Start the server
npm start 