@echo off
echo ========================================
echo   Setupay - Render CLI Deployment
echo ========================================
echo.

REM Check if Render CLI is installed
echo [1/4] Checking Render CLI...
where render >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] Render CLI not found. Installing...
    call npm install -g @render/cli
    if %ERRORLEVEL% NEQ 0 (
        echo [X] Failed to install Render CLI
        echo     Please install manually: npm install -g @render/cli
        pause
        exit /b 1
    )
    echo       Installed successfully!
) else (
    echo       Render CLI found!
)
echo.

REM Check version
echo [2/4] Render CLI Version:
call render --version
echo.

REM Login to Render
echo [3/4] Logging in to Render...
echo       (Browser will open for authentication)
call render login
if %ERRORLEVEL% NEQ 0 (
    echo [X] Login failed
    pause
    exit /b 1
)
echo       Logged in successfully!
echo.

REM Deploy
echo [4/4] Deploying to Render...
echo       This may take a few minutes...
call render deploy
if %ERRORLEVEL% NEQ 0 (
    echo [X] Deployment failed
    echo     Check logs: render logs setupay-backend
    pause
    exit /b 1
)
echo.

echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Your API is being deployed to Render.
echo.
echo Useful commands:
echo   render services list              - List all services
echo   render services get setupay-backend - Get service details
echo   render logs setupay-backend --tail  - View real-time logs
echo.
echo Next steps:
echo   1. Wait for deployment to complete (5-10 minutes)
echo   2. Get your service URL
echo   3. Update mobile app API URL
echo   4. Rebuild and install APK
echo.
pause
