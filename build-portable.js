const fs = require('fs');
const path = require('path');

// Create portable package structure
const distDir = path.join(__dirname, 'dist-portable');
const winDir = path.join(distDir, 'windows');

// Create directories
if (!fs.existsSync(winDir)) {
  fs.mkdirSync(winDir, { recursive: true });
}

// Create Windows launcher batch file
const launcherBat = `@echo off
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
`;

// Create Windows launcher PowerShell script (more modern)
const launcherPs1 = `# Complaint Management System Launcher
Write-Host "Starting Complaint Management System..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "WARNING: .env.local file not found!" -ForegroundColor Yellow
    Write-Host "Please create .env.local file with your MONGO_URL" -ForegroundColor Yellow
    Write-Host "Example: MONGO_URL=mongodb://localhost:27017/complaint_management" -ForegroundColor Gray
    Write-Host ""
}

# Start the application
Write-Host "Starting server on http://localhost:3000..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

npm start
`;

// Create README for portable package
const readme = `# Complaint Management System - Portable Package

## Installation Instructions

### For Windows Users:

1. Extract this package to a folder (e.g., C:\\CMS)

2. Install Node.js (if not already installed):
   - Download from: https://nodejs.org/
   - Install the LTS version
   - Make sure to check "Add to PATH" during installation

3. Open Command Prompt or PowerShell in the extracted folder

4. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

5. Create .env.local file in the root directory:
   \`\`\`env
   MONGO_URL=your_mongodb_connection_string
   \`\`\`

6. Build the application:
   \`\`\`bash
   npm run build
   \`\`\`

7. Run the application:
   - Double-click "Start-CMS.bat" (Windows)
   - Or run: npm start
   - Open browser to: http://localhost:3000

## Alternative: Create .exe using Electron Builder

To create a proper .exe file, you need to build on a Windows machine:

1. Install all dependencies: \`npm install\`
2. Build Next.js: \`npm run build\`
3. Build Electron app: \`npm run build:exe\`

The .exe file will be created in the \`dist\` folder.

## Requirements

- Node.js 18+ 
- MongoDB connection string
- Windows 10/11 (for .exe build)

## Support

For issues or questions, please refer to the main README.md file.
`;

// Write files
fs.writeFileSync(path.join(winDir, 'Start-CMS.bat'), launcherBat);
fs.writeFileSync(path.join(winDir, 'Start-CMS.ps1'), launcherPs1);
fs.writeFileSync(path.join(distDir, 'README-PORTABLE.txt'), readme);

console.log('✅ Portable package structure created in dist-portable/');
console.log('📦 Copy the entire project to dist-portable/windows/');
console.log('🚀 Users can run Start-CMS.bat to launch the application');

