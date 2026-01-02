@echo off
REM ============================================
REM Complaint Management System - Windows Build Script
REM यह script automatically .exe file बनाएगी
REM ============================================

echo.
echo ============================================
echo   Complaint Management System - Build Tool
echo   Windows .exe File Builder
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js installed nahi hai!
    echo.
    echo Please Node.js install karein:
    echo 1. https://nodejs.org/ par jayein
    echo 2. LTS version download karein
    echo 3. Install karein aur "Add to PATH" check karein
    echo 4. Command Prompt restart karein
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found!
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm installed nahi hai!
    pause
    exit /b 1
)

echo [OK] npm found!
npm --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Dependencies install kar rahe hain...
    echo Ye process 2-5 minutes le sakti hai...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install fail ho gaya!
        pause
        exit /b 1
    )
    echo [OK] Dependencies install ho gayi!
    echo.
) else (
    echo [OK] Dependencies already installed hain
    echo.
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo [WARNING] .env.local file nahi mili!
    echo.
    echo Please .env.local file banayein with MongoDB connection:
    echo.
    echo MONGO_URL=mongodb://localhost:27017/complaint_management
    echo.
    echo Ya MongoDB Atlas ke liye:
    echo MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/complaint_management
    echo.
    set /p continue="Continue anyway? (y/n): "
    if /i not "%continue%"=="y" (
        echo Build cancelled.
        pause
        exit /b 1
    )
    echo.
) else (
    echo [OK] .env.local file mili
    echo.
)

REM Build Next.js application
echo ============================================
echo Step 1: Next.js Application Build
echo ============================================
echo.
echo Ye process 1-2 minutes le sakti hai...
echo.

call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Next.js build fail ho gaya!
    echo Please errors check karein aur fix karein.
    pause
    exit /b 1
)

echo.
echo [OK] Next.js build successful!
echo.

REM Build Electron executable
echo ============================================
echo Step 2: Windows .exe File Build
echo ============================================
echo.
echo Ye process 5-10 minutes le sakti hai...
echo Electron aur Windows tools download honge...
echo.

call npm run build:exe
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] .exe file build fail ho gaya!
    echo Please errors check karein.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   BUILD SUCCESSFUL!
echo ============================================
echo.
echo Aapki .exe files ready hain!
echo.
echo Installer file:
echo   dist\Complaint Management System Setup 0.1.0.exe
echo.
echo Portable executable:
echo   dist\win-unpacked\Complaint Management System.exe
echo.
echo Files ko check karne ke liye dist folder kholen.
echo.

REM Open dist folder
set /p open="Dist folder kholna hai? (y/n): "
if /i "%open%"=="y" (
    explorer dist
)

echo.
echo Thank you for using Build Tool!
pause

