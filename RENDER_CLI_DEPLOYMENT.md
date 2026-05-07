# Setupay - Render CLI Deployment

Deploy Setupay backend using Render CLI (Command Line Interface)

## 📦 Step 1: Install Render CLI

### Windows (PowerShell)
```powershell
# Using npm (recommended)
npm install -g @render/cli

# Or using Scoop
scoop install render
```

### Linux/Mac
```bash
# Using npm
npm install -g @render/cli

# Or using Homebrew (Mac)
brew install render

# Or using curl
curl -fsSL https://render.com/install.sh | bash
```

### Verify Installation
```bash
render --version
```

## 🔑 Step 2: Login to Render

```bash
render login
```

This will:
1. Open browser for authentication
2. Ask you to authorize the CLI
3. Save credentials locally

## 🚀 Step 3: Deploy Using render.yaml

Since you already have `render.yaml` in your repository:

```bash
# Navigate to project root
cd C:\duyworld\payment-app

# Deploy using render.yaml
render deploy
```

## 📝 Alternative: Manual CLI Deployment

If you want to deploy without render.yaml:

### Create Service
```bash
render services create web \
  --name setupay-backend \
  --repo https://github.com/dharaahirwal/Setupay \
  --branch main \
  --buildCommand "cd backend && npm install" \
  --startCommand "cd backend && npm start" \
  --plan free \
  --region oregon
```

### Set Environment Variables
```bash
# Set each environment variable
render env set NODE_ENV=production
render env set PORT=5000
render env set MONGODB_URI="your-mongodb-connection-string"
render env set JWT_SECRET="setupay_jwt_secret_2024_production"
render env set JWT_EXPIRES_IN=7d
```

### Deploy
```bash
render deploy
```

## 🔧 Useful CLI Commands

### List Services
```bash
render services list
```

### View Service Details
```bash
render services get setupay-backend
```

### View Logs
```bash
render logs setupay-backend
```

### Tail Logs (Real-time)
```bash
render logs setupay-backend --tail
```

### Set Environment Variable
```bash
render env set KEY=VALUE
```

### List Environment Variables
```bash
render env list
```

### Restart Service
```bash
render services restart setupay-backend
```

### Delete Service
```bash
render services delete setupay-backend
```

## 📊 Monitor Deployment

### Check Deployment Status
```bash
render deploys list setupay-backend
```

### Get Latest Deploy Info
```bash
render deploys get setupay-backend latest
```

## 🎯 Complete Deployment Script

Create a deployment script for easy deployment:

### Windows (deploy.bat)
```batch
@echo off
echo ========================================
echo   Setupay - Render CLI Deployment
echo ========================================
echo.

echo [1/3] Checking Render CLI...
render --version
if %ERRORLEVEL% NEQ 0 (
    echo [!] Render CLI not found. Installing...
    npm install -g @render/cli
)
echo.

echo [2/3] Logging in to Render...
render login
echo.

echo [3/3] Deploying to Render...
render deploy
echo.

echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo View your service:
echo   render services get setupay-backend
echo.
echo View logs:
echo   render logs setupay-backend --tail
echo.
pause
```

### Linux/Mac (deploy.sh)
```bash
#!/bin/bash

echo "========================================"
echo "  Setupay - Render CLI Deployment"
echo "========================================"
echo

echo "[1/3] Checking Render CLI..."
if ! command -v render &> /dev/null; then
    echo "[!] Render CLI not found. Installing..."
    npm install -g @render/cli
fi
echo

echo "[2/3] Logging in to Render..."
render login
echo

echo "[3/3] Deploying to Render..."
render deploy
echo

echo "========================================"
echo "  Deployment Complete!"
echo "========================================"
echo
echo "View your service:"
echo "  render services get setupay-backend"
echo
echo "View logs:"
echo "  render logs setupay-backend --tail"
```

## 🔐 Environment Variables via CLI

### Set All Variables at Once
```bash
# Create a .env file for Render (don't commit this!)
cat > render.env << EOF
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/setupay
JWT_SECRET=setupay_jwt_secret_2024_production
JWT_EXPIRES_IN=7d
EOF

# Load from file
render env set --file render.env

# Delete the file after setting
rm render.env
```

### Or Set Individually
```bash
render env set NODE_ENV=production
render env set PORT=5000
render env set MONGODB_URI="mongodb+srv://setupay-admin:password@cluster.mongodb.net/setupay?retryWrites=true&w=majority"
render env set JWT_SECRET="setupay_jwt_secret_2024_production_random_key"
render env set JWT_EXPIRES_IN=7d
```

## 🐛 Troubleshooting

### CLI Not Found
```bash
# Reinstall
npm uninstall -g @render/cli
npm install -g @render/cli

# Or use npx
npx @render/cli login
npx @render/cli deploy
```

### Authentication Failed
```bash
# Logout and login again
render logout
render login
```

### Deployment Failed
```bash
# Check logs
render logs setupay-backend --tail

# Check service status
render services get setupay-backend

# Restart service
render services restart setupay-backend
```

### Environment Variables Not Set
```bash
# List current variables
render env list

# Set missing variables
render env set KEY=VALUE
```

## 📱 Update Mobile App After Deployment

After successful deployment, get your service URL:

```bash
render services get setupay-backend
```

Look for the URL (e.g., `https://setupay-backend.onrender.com`)

Update `mobile/src/api/client.js`:
```javascript
const BASE_URL = 'https://setupay-backend.onrender.com/api';
```

Rebuild APK:
```bash
cd mobile/android
./gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
```

## 🎉 Quick Deploy Commands

```bash
# One-time setup
npm install -g @render/cli
render login

# Deploy
cd C:\duyworld\payment-app
render deploy

# Monitor
render logs setupay-backend --tail
```

## 📚 Additional Resources

- Render CLI Docs: https://render.com/docs/cli
- Render API Docs: https://api-docs.render.com
- GitHub: https://github.com/render-examples

---

**Made with ❤️ by Dhara Ahirwal**
