# ============================================
# Complaint Management System - Windows Build Script (PowerShell)
# यह script automatically .exe file बनाएगी
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Complaint Management System - Build Tool" -ForegroundColor Cyan
Write-Host "  Windows .exe File Builder" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js installed nahi hai!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please Node.js install karein:" -ForegroundColor Yellow
    Write-Host "1. https://nodejs.org/ par jayein" -ForegroundColor Gray
    Write-Host "2. LTS version download karein" -ForegroundColor Gray
    Write-Host "3. Install karein aur 'Add to PATH' check karein" -ForegroundColor Gray
    Write-Host "4. PowerShell restart karein" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "[OK] npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm installed nahi hai!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Dependencies install kar rahe hain..." -ForegroundColor Yellow
    Write-Host "Ye process 2-5 minutes le sakti hai..." -ForegroundColor Gray
    Write-Host ""
    
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] npm install fail ho gaya!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "[OK] Dependencies install ho gayi!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[OK] Dependencies already installed hain" -ForegroundColor Green
    Write-Host ""
}

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "[WARNING] .env.local file nahi mili!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please .env.local file banayein with MongoDB connection:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "MONGO_URL=mongodb://localhost:27017/complaint_management" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Ya MongoDB Atlas ke liye:" -ForegroundColor Gray
    Write-Host "MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/complaint_management" -ForegroundColor Gray
    Write-Host ""
    
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "Build cancelled." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 0
    }
    Write-Host ""
} else {
    Write-Host "[OK] .env.local file mili" -ForegroundColor Green
    Write-Host ""
}

# Build Next.js application
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Step 1: Next.js Application Build" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ye process 1-2 minutes le sakti hai..." -ForegroundColor Gray
Write-Host ""

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Next.js build fail ho gaya!" -ForegroundColor Red
    Write-Host "Please errors check karein aur fix karein." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[OK] Next.js build successful!" -ForegroundColor Green
Write-Host ""

# Build Electron executable
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Step 2: Windows .exe File Build" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ye process 5-10 minutes le sakti hai..." -ForegroundColor Gray
Write-Host "Electron aur Windows tools download honge..." -ForegroundColor Gray
Write-Host ""

npm run build:exe
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] .exe file build fail ho gaya!" -ForegroundColor Red
    Write-Host "Please errors check karein." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Aapki .exe files ready hain!" -ForegroundColor Green
Write-Host ""
Write-Host "Installer file:" -ForegroundColor Cyan
Write-Host "  dist\Complaint Management System Setup 0.1.0.exe" -ForegroundColor White
Write-Host ""
Write-Host "Portable executable:" -ForegroundColor Cyan
Write-Host "  dist\win-unpacked\Complaint Management System.exe" -ForegroundColor White
Write-Host ""
Write-Host "Files ko check karne ke liye dist folder kholen." -ForegroundColor Gray
Write-Host ""

# Open dist folder
$open = Read-Host "Dist folder kholna hai? (y/n)"
if ($open -eq "y" -or $open -eq "Y") {
    if (Test-Path "dist") {
        explorer dist
    } else {
        Write-Host "Dist folder nahi mila!" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Thank you for using Build Tool!" -ForegroundColor Green
Read-Host "Press Enter to exit"

