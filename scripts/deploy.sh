#!/bin/bash

echo "🚀 Resume Optimizer Deployment Script"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if build exists
if [ ! -d ".next" ]; then
    echo "📦 Building application..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Please fix errors and try again."
        exit 1
    fi
fi

echo "✅ Build successful!"

# Check environment variables
echo ""
echo "🔍 Checking environment variables..."

required_vars=(
    "OPENAI_API_KEY"
    "NEXTAUTH_SECRET"
    "NEXTAUTH_URL"
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "STRIPE_SECRET_KEY"
    "STRIPE_WEBHOOK_SECRET"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    else
        echo "✅ $var: Set"
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo ""
    echo "❌ Missing environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please set these variables before deploying."
    exit 1
fi

echo ""
echo "🎯 Deployment Options:"
echo "1. Deploy to Vercel (Recommended)"
echo "2. Deploy to Railway"
echo "3. Deploy to DigitalOcean"
echo "4. Show deployment guide"

read -p "Choose an option (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Vercel..."
        echo ""
        echo "1. Go to https://vercel.com"
        echo "2. Sign up with GitHub"
        echo "3. Import your repository"
        echo "4. Set environment variables:"
        echo ""
        for var in "${required_vars[@]}"; do
            echo "   $var=${!var}"
        done
        echo ""
        echo "5. Deploy!"
        ;;
    2)
        echo ""
        echo "🚀 Deploying to Railway..."
        echo ""
        echo "1. Go to https://railway.app"
        echo "2. Sign up with GitHub"
        echo "3. Create new project"
        echo "4. Connect your repository"
        echo "5. Set environment variables"
        echo "6. Deploy!"
        ;;
    3)
        echo ""
        echo "🚀 Deploying to DigitalOcean..."
        echo ""
        echo "1. Go to https://cloud.digitalocean.com"
        echo "2. Create App Platform project"
        echo "3. Connect your repository"
        echo "4. Configure build settings"
        echo "5. Set environment variables"
        echo "6. Deploy!"
        ;;
    4)
        echo ""
        echo "📖 Opening deployment guide..."
        if command -v open &> /dev/null; then
            open scripts/setup-production.md
        elif command -v xdg-open &> /dev/null; then
            xdg-open scripts/setup-production.md
        else
            echo "Please open scripts/setup-production.md manually"
        fi
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment instructions completed!"
echo ""
echo "Next steps:"
echo "1. Follow the platform-specific instructions above"
echo "2. Set up your production database"
echo "3. Configure Google OAuth for production"
echo "4. Configure Stripe for production"
echo "5. Test your deployment"
echo ""
echo "Need help? Check scripts/setup-production.md for detailed instructions."
