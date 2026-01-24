@echo off
REM Start both Flask and Express servers
REM Run this from the Backend folder

echo.
echo ========================================
echo Starting AgroConnect Servers
echo ========================================
echo.

REM Check if venv exists
if not exist "venv" (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

REM Check if .env exists
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Please create .env file using .env.example as template
    echo.
)

echo Starting Flask API (Python)...
echo Terminal window will open for Flask server...
start cmd /k "venv\Scripts\activate.bat && cd src\mlmodel && python app.py"

timeout /t 3

echo.
echo Starting Express Backend (Node.js)...
echo Terminal window will open for Express server...
start cmd /k "npm start"

echo.
echo ========================================
echo Both servers starting...
echo ========================================
echo.
echo Flask API:  http://localhost:5001
echo Express:    http://localhost:5000
echo.
echo Check both terminal windows for any errors.
echo Press Ctrl+C in each terminal to stop servers.
echo.

pause
