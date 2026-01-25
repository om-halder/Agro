@echo off
REM Quick start script for AgroConnect Backend with ML Model
REM Run this from the Backend folder

echo.
echo ========================================
echo AgroConnect Backend Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.10+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Python found: 
python --version

echo ✓ Node.js found: 
node --version

echo.
echo Step 1: Creating Python virtual environment...
if not exist "venv" (
    python -m venv venv
    echo ✓ Virtual environment created
) else (
    echo ✓ Virtual environment already exists
)

echo.
echo Step 2: Activating virtual environment and installing Python dependencies...
call venv\Scripts\activate.bat
pip install --upgrade pip >nul 2>&1
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✓ Python dependencies installed

echo.
echo Step 3: Installing Node.js dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo ✓ Node.js dependencies installed

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy your crop_disease_model.h5 to: Backend\src\mlmodel\
echo 2. Create .env file with your API keys (see .env.example)
echo 3. Run start-servers.bat to start both servers
echo.
echo Or manually start:
echo   Terminal 1: python src\mlmodel\app.py
echo   Terminal 2: npm start
echo.
pause
