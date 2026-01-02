#!/bin/bash

# Script to install Wine for building Windows executables on Linux
# Run this script with: bash install-wine.sh

echo "🍷 Installing Wine for Windows .exe building..."
echo ""

# Check if running on Ubuntu/Debian
if [ -f /etc/debian_version ]; then
    echo "Detected Ubuntu/Debian system"
    echo ""
    echo "Step 1: Enable 32-bit architecture"
    sudo dpkg --add-architecture i386
    
    echo ""
    echo "Step 2: Add WineHQ repository key"
    sudo mkdir -pm755 /etc/apt/keyrings
    sudo wget -O /etc/apt/keyrings/winehq-archive.key https://dl.winehq.org/wine-builds/winehq.key
    
    echo ""
    echo "Step 3: Add WineHQ repository"
    UBUNTU_VERSION=$(lsb_release -cs)
    sudo wget -NP /etc/apt/sources.list.d/ https://dl.winehq.org/wine-builds/ubuntu/dists/${UBUNTU_VERSION}/winehq-${UBUNTU_VERSION}.sources
    
    echo ""
    echo "Step 4: Update package list"
    sudo apt-get update
    
    echo ""
    echo "Step 5: Install Wine"
    sudo apt-get install --install-recommends winehq-stable -y
    
    echo ""
    echo "✅ Wine installation complete!"
    echo ""
    echo "Verifying installation..."
    wine --version
    
    echo ""
    echo "🎉 Wine is now installed. You can now run: npm run build:exe"
    
else
    echo "This script is for Ubuntu/Debian systems."
    echo "For other distributions, please install Wine manually:"
    echo "  - Fedora: sudo dnf install wine"
    echo "  - Arch: sudo pacman -S wine"
    echo "  - See: https://www.winehq.org/download"
fi

