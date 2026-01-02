#!/bin/bash

# Quick Wine installation for Ubuntu 24.04
# Run: bash QUICK-INSTALL-WINE.sh

echo "🍷 Quick Wine Installation for Windows .exe Building"
echo "======================================================"
echo ""

# Check if already installed
if command -v wine &> /dev/null; then
    echo "✅ Wine is already installed!"
    wine --version
    exit 0
fi

echo "This will install Wine using the system package manager."
echo "You will be prompted for your sudo password."
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo ""
echo "Installing Wine (this may take a few minutes)..."
echo ""

# Simple installation method
sudo apt-get update
sudo apt-get install -y wine64 wine32

# Verify installation
if command -v wine &> /dev/null; then
    echo ""
    echo "✅ Wine installed successfully!"
    wine --version
    echo ""
    echo "🎉 You can now run: npm run build:exe"
else
    echo ""
    echo "❌ Installation may have failed. Try the full installation:"
    echo "   bash install-wine.sh"
    echo ""
    echo "Or see INSTALL-WINE.md for manual instructions."
fi

