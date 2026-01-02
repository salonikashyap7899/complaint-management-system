# Installing Wine for Windows .exe Building

To build Windows `.exe` files from Linux, you need to install **Wine**.

## Quick Installation (Ubuntu/Debian)

Run the provided script:

```bash
bash install-wine.sh
```

This will automatically install Wine with all necessary dependencies.

## Manual Installation

If you prefer to install manually or the script doesn't work:

### For Ubuntu 24.04 (Noble):

```bash
# 1. Enable 32-bit architecture
sudo dpkg --add-architecture i386

# 2. Add WineHQ repository key
sudo mkdir -pm755 /etc/apt/keyrings
sudo wget -O /etc/apt/keyrings/winehq-archive.key https://dl.winehq.org/wine-builds/winehq.key

# 3. Add WineHQ repository
sudo wget -NP /etc/apt/sources.list.d/ https://dl.winehq.org/wine-builds/ubuntu/dists/noble/winehq-noble.sources

# 4. Update package list
sudo apt-get update

# 5. Install Wine
sudo apt-get install --install-recommends winehq-stable
```

### For Other Ubuntu Versions:

Replace `noble` with your Ubuntu codename:
- Ubuntu 22.04: `jammy`
- Ubuntu 20.04: `focal`
- Ubuntu 18.04: `bionic`

Find your codename with:
```bash
lsb_release -cs
```

### For Other Linux Distributions:

- **Fedora**: `sudo dnf install wine`
- **Arch Linux**: `sudo pacman -S wine`
- **openSUSE**: `sudo zypper install wine`

## Verify Installation

After installation, verify Wine is working:

```bash
wine --version
```

You should see something like: `wine-8.0` or similar.

## Build the .exe

Once Wine is installed, you can build the Windows executable:

```bash
npm run build:exe
```

The `.exe` file will be created in the `dist/` folder.

## Troubleshooting

### Error: "wine: command not found"
- Make sure Wine is installed: `which wine`
- Try restarting your terminal after installation

### Error: "Cannot find Wine Gecko"
- Wine will download it automatically on first run
- Or install manually: `winetricks gecko`

### Build still fails
- Make sure you have enough disk space (Wine and Electron downloads are large)
- Check internet connection (Wine downloads Windows components)
- Try: `winecfg` to configure Wine (this will download Wine Gecko if needed)

## Alternative: Build on Windows

If Wine installation is problematic, you can:
1. Copy the project to a Windows machine
2. Run: `npm install && npm run build && npm run build:exe`
3. The `.exe` will be in the `dist/` folder

