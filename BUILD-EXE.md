# Building Windows .exe File

## Option 1: Build on Windows Machine (Recommended)

To create a Windows .exe file, you need to build it on a Windows machine:

### Steps:

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Install the LTS version

2. **Copy the project** to your Windows machine

3. **Open Command Prompt or PowerShell** in the project directory

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Build the Next.js application:**
   ```bash
   npm run build
   ```

6. **Build the Electron executable:**
   ```bash
   npm run build:exe
   ```

7. **Find your .exe file:**
   - The installer will be in: `dist/Complaint Management System Setup x.x.x.exe`
   - The unpacked executable will be in: `dist/win-unpacked/Complaint Management System.exe`

## Option 2: Build from Linux (Requires Wine)

If you want to build Windows .exe from Linux, you need to install Wine:

### Install Wine:

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install wine64 wine32

# Or use WineHQ repository for latest version
```

Then run:
```bash
npm run build:exe
```

## Option 3: Portable Package (No .exe needed)

If you don't need a single .exe file, you can create a portable package:

```bash
npm run package:win
```

This creates a portable package in `dist-portable/` that can be run on Windows with Node.js installed.

## Troubleshooting

### Error: "wine is required"
- Install Wine (see Option 2)
- Or build on a Windows machine (Option 1 - Recommended)

### Error: "icon file not found"
- The build will use default Electron icon
- To add custom icon, create a `.ico` file and update `electron-builder.yml`

### MongoDB Connection
- Make sure to set `MONGO_URL` in `.env.local` file
- The executable will need access to MongoDB (local or cloud)

## Distribution

After building, you can distribute:
- **Installer**: `dist/Complaint Management System Setup x.x.x.exe` (for end users)
- **Portable**: `dist/win-unpacked/` folder (contains all files needed to run)

## Notes

- The .exe file includes the entire Next.js application
- Users still need MongoDB connection (configured in .env.local)
- The executable is quite large (~150-200 MB) as it includes Electron and all dependencies
- First run may take a few seconds to start the Next.js server

