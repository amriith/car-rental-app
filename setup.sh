#!/bin/bash

# Rental App Integration Setup Script
echo "🚀 Setting up Rental App Frontend-Backend Integration..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/rental_app"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Configuration
PORT=3001
FRONTEND_URL="http://localhost:5173"

# Environment
NODE_ENV=development
EOF
    echo "📝 Please update the .env file with your actual database credentials"
fi

# Check if Prisma is configured
if [ ! -f prisma/schema.prisma ]; then
    echo "❌ Prisma schema not found. Please ensure the schema exists."
    exit 1
fi

echo "✅ Prisma schema found"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Check if database is accessible (optional)
echo "🔍 Checking database connection..."
if npx prisma db push --accept-data-loss 2>/dev/null; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Database connection failed. Please check your DATABASE_URL in .env"
    echo "   You can run 'npx prisma db push' manually after fixing the connection"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with correct database credentials"
echo "2. Run 'npx prisma db push' to sync your database schema"
echo "3. Start the development servers with 'npm run dev:full'"
echo ""
echo "Available commands:"
echo "  npm run dev:full     - Start both frontend and backend"
echo "  npm run server:dev   - Start backend only"
echo "  npm run frontend:dev - Start frontend only"
echo "  npm run build:full   - Build for production"
echo ""
echo "Frontend will be available at: http://localhost:5173"
echo "Backend API will be available at: http://localhost:3001"
echo ""
echo "Happy coding! 🚗✨"
