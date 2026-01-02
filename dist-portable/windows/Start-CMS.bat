@echo off
echo Starting Complaint Management System...
echo.
echo Please make sure you have Node.js installed on your system.
echo If Node.js is not installed, download it from https://nodejs.org/
echo.
pause

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo WARNING: .env.local file not found!
    echo Please create .env.local file with your MONGO_URL
    echo Example: MONGO_URL=mongodb://localhost:27017/complaint_management
    echo.
    pause
)

REM Start the application
echo Starting server...
call npm start

pause
