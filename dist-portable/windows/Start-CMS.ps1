# Complaint Management System Launcher
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
