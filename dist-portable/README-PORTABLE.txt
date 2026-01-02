# Complaint Management System - Portable Package

## Installation Instructions

### For Windows Users:

1. Extract this package to a folder (e.g., C:\CMS)

2. Install Node.js (if not already installed):
   - Download from: https://nodejs.org/
   - Install the LTS version
   - Make sure to check "Add to PATH" during installation

3. Open Command Prompt or PowerShell in the extracted folder

4. Install dependencies:
   ```bash
   npm install
   ```

5. Create .env.local file in the root directory:
   ```env
   MONGO_URL=your_mongodb_connection_string
   ```

6. Build the application:
   ```bash
   npm run build
   ```

7. Run the application:
   - Double-click "Start-CMS.bat" (Windows)
   - Or run: npm start
   - Open browser to: http://localhost:3000

## Alternative: Create .exe using Electron Builder

To create a proper .exe file, you need to build on a Windows machine:

1. Install all dependencies: `npm install`
2. Build Next.js: `npm run build`
3. Build Electron app: `npm run build:exe`

The .exe file will be created in the `dist` folder.

## Requirements

- Node.js 18+ 
- MongoDB connection string
- Windows 10/11 (for .exe build)

## Support

For issues or questions, please refer to the main README.md file.
