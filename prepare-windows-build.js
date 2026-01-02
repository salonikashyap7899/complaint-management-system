#!/usr/bin/env node

/**
 * This script prepares the project for Windows .exe building
 * It creates necessary files and checks requirements
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Preparing project for Windows .exe build...\n');

// Check if .env.local exists
const envLocalPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.log('⚠️  WARNING: .env.local file not found!');
  console.log('   Creating .env.local.example...\n');
  
  const envExample = `# MongoDB Connection String
# Replace with your actual MongoDB connection string
MONGO_URL=mongodb://localhost:27017/complaint_management
# Or for MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/complaint_management?retryWrites=true&w=majority
`;
  
  fs.writeFileSync(path.join(__dirname, '.env.local.example'), envExample);
  console.log('   Please create .env.local file with your MONGO_URL\n');
}

// Check if build directory exists
const buildDir = path.join(__dirname, '.next');
if (!fs.existsSync(buildDir)) {
  console.log('📦 Next.js build not found. Building now...\n');
  const { execSync } = require('child_process');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('\n✅ Build completed!\n');
  } catch (error) {
    console.error('\n❌ Build failed! Please run: npm run build\n');
    process.exit(1);
  }
} else {
  console.log('✅ Next.js build found\n');
}

// Create build instructions
const instructions = `
✅ Project is ready for Windows .exe build!

📋 Next Steps (on Windows machine):

1. Make sure Node.js is installed
   Download from: https://nodejs.org/

2. Install dependencies:
   npm install

3. Build Next.js app:
   npm run build

4. Build Electron executable:
   npm run build:exe

5. Find your .exe in:
   - Installer: dist/Complaint Management System Setup x.x.x.exe
   - Portable: dist/win-unpacked/Complaint Management System.exe

📝 Note: Building Windows .exe from Linux requires Wine.
   It's easier to build on a Windows machine.

For more details, see BUILD-EXE.md
`;

console.log(instructions);

