@echo off
echo ========================================
echo   PayApp - Local Development Setup
echo ========================================
echo.
echo Your Local IP: 172.21.232.45
echo Backend URL: http://172.21.232.45:5000
echo.

REM Check if MongoDB is running
echo [1/5] Checking MongoDB...
sc query MongoDB >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo       MongoDB service found
    sc query MongoDB | findstr "RUNNING" >nul
    if %ERRORLEVEL% EQU 0 (
        echo       MongoDB is running ✓
    ) else (
        echo       MongoDB is not running - attempting to start...
        net start MongoDB
        if %ERRORLEVEL% NEQ 0 (
            echo       [!] Failed to start MongoDB
            echo       Please install MongoDB or start it manually
            echo       See MONGODB_SETUP.md for instructions
            pause
            exit /b 1
        )
    )
) else (
    echo       [!] MongoDB not installed
    echo       Please install MongoDB first
    echo       See MONGODB_SETUP.md for instructions
    pause
    exit /b 1
)
echo.

REM Check backend dependencies
echo [2/5] Checking backend dependencies...
cd backend
if not exist "node_modules" (
    echo       Installing backend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo       [!] Failed to install backend dependencies
        cd ..
        pause
        exit /b 1
    )
) else (
    echo       Backend dependencies installed ✓
)
cd ..
echo.

REM Seed database
echo [3/5] Seeding database...
cd backend
call npm run seed
if %ERRORLEVEL% NEQ 0 (
    echo       [!] Database seeding failed
    echo       Make sure MongoDB is running
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

REM Configure firewall
echo [4/5] Configuring firewall...
netsh advfirewall firewall show rule name="PayApp Backend" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo       Adding firewall rule for port 5000...
    netsh advfirewall firewall add rule name="PayApp Backend" dir=in action=allow protocol=TCP localport=5000 >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo       Firewall rule added ✓
    ) else (
        echo       [!] Failed to add firewall rule (needs admin rights)
        echo       You may need to manually allow port 5000
    )
) else (
    echo       Firewall rule already exists ✓
)
echo.

REM Rebuild mobile app with new IP
echo [5/5] Rebuilding mobile app...
echo       This will take a few minutes...
cd mobile\android
call gradlew.bat assembleRelease --no-daemon -q
if %ERRORLEVEL% NEQ 0 (
    echo       [!] Build failed
    cd ..\..
    pause
    exit /b 1
)
cd ..\..
echo       APK built successfully ✓
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Start backend server:
echo      cd backend
echo      npm run dev
echo.
echo   2. Install APK on device:
echo      adb install -r mobile\android\app\build\outputs\apk\release\app-release.apk
echo.
echo   3. Test backend:
echo      Open browser: http://172.21.232.45:5000/health
echo.
echo Test Users (Phone / PIN):
echo   9876543210 / 1234 (₹10,000)
echo   9876543211 / 1234 (₹5,000)
echo   9876543212 / 1234 (₹7,500)
echo.
pause
