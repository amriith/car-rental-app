@echo off
REM Rental App Integration Setup Script for Windows
echo 🚀 Setting up Rental App Frontend-Backend Integration...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install backend dependencies
echo 📦 Installing backend dependencies...
npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found. Creating template...
    (
        echo # Database Configuration
        echo DATABASE_URL="postgresql://username:password@localhost:5432/rental_app"
        echo.
        echo # JWT Configuration
        echo JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
        echo.
        echo # Server Configuration
        echo PORT=3001
        echo FRONTEND_URL="http://localhost:5173"
        echo.
        echo # Environment
        echo NODE_ENV=development
    ) > .env
    echo 📝 Please update the .env file with your actual database credentials
)

REM Check if Prisma is configured
if not exist prisma\schema.prisma (
    echo ❌ Prisma schema not found. Please ensure the schema exists.
    pause
    exit /b 1
)

echo ✅ Prisma schema found

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npx prisma generate

REM Check if database is accessible (optional)
echo 🔍 Checking database connection...
npx prisma db push --accept-data-loss >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Database connection successful
) else (
    echo ⚠️  Database connection failed. Please check your DATABASE_URL in .env
    echo    You can run 'npx prisma db push' manually after fixing the connection
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update your .env file with correct database credentials
echo 2. Run 'npx prisma db push' to sync your database schema
echo 3. Start the development servers with 'npm run dev:full'
echo.
echo Available commands:
echo   npm run dev:full     - Start both frontend and backend
echo   npm run server:dev   - Start backend only
echo   npm run frontend:dev - Start frontend only
echo   npm run build:full   - Build for production
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:3001
echo.
echo Happy coding! 🚗✨
pause
