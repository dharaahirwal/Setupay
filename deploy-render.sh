#!/bin/bash

echo "========================================"
echo "  Setupay - Render CLI Deployment"
echo "========================================"
echo

# Check if Render CLI is installed
echo "[1/4] Checking Render CLI..."
if ! command -v render &> /dev/null; then
    echo "[!] Render CLI not found. Installing..."
    npm install -g @render/cli
    if [ $? -ne 0 ]; then
        echo "[X] Failed to install Render CLI"
        echo "    Please install manually: npm install -g @render/cli"
        exit 1
    fi
    echo "    Installed successfully!"
else
    echo "    Render CLI found!"
fi
echo

# Check version
echo "[2/4] Render CLI Version:"
render --version
echo

# Login to Render
echo "[3/4] Logging in to Render..."
echo "    (Browser will open for authentication)"
render login
if [ $? -ne 0 ]; then
    echo "[X] Login failed"
    exit 1
fi
echo "    Logged in successfully!"
echo

# Deploy
echo "[4/4] Deploying to Render..."
echo "    This may take a few minutes..."
render deploy
if [ $? -ne 0 ]; then
    echo "[X] Deployment failed"
    echo "    Check logs: render logs setupay-backend"
    exit 1
fi
echo

echo "========================================"
echo "  Deployment Complete!"
echo "========================================"
echo
echo "Your API is being deployed to Render."
echo
echo "Useful commands:"
echo "  render services list              - List all services"
echo "  render services get setupay-backend - Get service details"
echo "  render logs setupay-backend --tail  - View real-time logs"
echo
echo "Next steps:"
echo "  1. Wait for deployment to complete (5-10 minutes)"
echo "  2. Get your service URL"
echo "  3. Update mobile app API URL"
echo "  4. Rebuild and install APK"
echo
