@echo off
REM AgroConnect - Production Setup Script (Windows)
REM This script optimizes and builds the application for production

setlocal enabledelayedexpansion

echo.
echo 🚀 AgroConnect Production Setup
echo ================================

REM Check if we're in the right directory
if not exist "README.md" (
    echo Error: Run this script from the project root directory
    exit /b 1
)

REM 1. Frontend Setup
echo.
echo Step 1: Building Frontend...
cd Frontend
call npm install --production
call npm run build
echo ✓ Frontend built successfully
cd ..

REM 2. Backend Setup
echo.
echo Step 2: Setting up Backend...
cd Backend
call npm install --production
echo ✓ Backend dependencies installed
cd ..

REM 3. Python Setup (Optional)
echo.
echo Step 3: Setting up ML Model...
where python >nul 2>nul
if %errorlevel% equ 0 (
    cd Backend
    call pip install -r requirements.txt --no-cache-dir --no-deps
    echo ✓ Python dependencies installed
    cd ..
) else (
    echo ⚠ Python not found. Skipping ML model setup.
)

REM 4. Environment setup
echo.
echo Step 4: Checking environment configuration...
if exist ".env.production" (
    echo ✓ Production environment file exists
    echo  Don't forget to update the values in .env.production
) else (
    echo ✗ .env.production not found
    exit /b 1
)

REM 5. Docker setup (Optional)
where docker >nul 2>nul
if %errorlevel% equ 0 (
    echo.
    echo Step 5: Docker is installed
    echo Run: docker-compose -f docker-compose.yml up -d
)

echo.
echo ========================================
echo ✓ Production setup complete!
echo ========================================
echo.
echo 📋 Next steps:
echo 1. Update .env.production with your credentials
echo 2. For standalone: npm start in Backend, npm start in Frontend
echo 3. For Docker: docker-compose -f docker-compose.yml up -d
echo 4. Verify health: curl http://localhost:5000/health
echo.
echo 📚 See PRODUCTION_DEPLOYMENT.md for detailed instructions
echo.

endlocal
