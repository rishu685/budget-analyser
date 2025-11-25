#!/bin/bash

echo "🚀 BudgetBox Deployment Script"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from project root."
    exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Run type check
echo "🔍 Running type check..."
npm run type-check

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Add all files to git
    echo "📝 Adding files to git..."
    git add .
    
    # Commit changes
    echo "💾 Committing changes..."
    git commit -m "Deploy BudgetBox - $(date)"
    
    echo ""
    echo "🎯 Ready to deploy! Choose your deployment method:"
    echo ""
    echo "1. VERCEL (Recommended):"
    echo "   - Go to https://vercel.com"
    echo "   - Import your GitHub repository"
    echo "   - Auto-deploys on every push"
    echo ""
    echo "2. GITHUB + VERCEL:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/budgetbox.git"
    echo "   git push -u origin main"
    echo ""
    echo "3. RAILWAY:"
    echo "   - Go to https://railway.app"
    echo "   - Connect GitHub repository"
    echo ""
    echo "4. NETLIFY:"
    echo "   - Go to https://netlify.com"
    echo "   - Drag & drop the .next folder"
    echo ""
    echo "Demo credentials for deployed app:"
    echo "Email: hire-me@anshumat.org"
    echo "Password: HireMe@2025!"
    echo ""
    echo "🎉 Your app is ready for production!"
    
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi