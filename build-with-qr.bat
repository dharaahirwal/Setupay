@echo off
echo ========================================
echo   PayApp - Build with QR Features
echo ========================================
echo.

REM Step 1: Install QR dependencies
echo [1/4] Installing QR code dependencies...
cd mobile
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [!] npm install failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo       Done ✓
echo.

REM Step 2: Clean Android build
echo [2/4] Cleaning Android build...
cd mobile\android
call gradlew clean >nul 2>&1
cd ..\..
echo       Done ✓
echo.

REM Step 3: Build release APK
echo [3/4] Building release APK (this takes a few minutes)...
cd mobile\android
call gradlew assembleRelease --no-daemon
if %ERRORLEVEL% NEQ 0 (
    echo [!] Build failed
    cd ..\..
    pause
    exit /b 1
)
cd ..\..
echo       Done ✓
echo.

REM Step 4: Install on device
echo [4/4] Installing on device...
set APK_PATH=mobile\android\app\build\outputs\apk\release\app-release.apk

if not exist "%APK_PATH%" (
    echo [!] APK not found
    pause
    exit /b 1
)

"C:\Users\dhara\AppData\Local\Android\Sdk\platform-tools\adb.exe" devices | findstr "device" | findstr /V "List" >nul
if %ERRORLEVEL% EQU 0 (
    "C:\Users\dhara\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r "%APK_PATH%"
    if %ERRORLEVEL% EQU 0 (
        echo       Installed ✓
    ) else (
        echo [!] Installation failed
    )
) else (
    echo [!] No device connected
    echo     APK ready at: %APK_PATH%
)
echo.

echo ========================================
echo   Build Complete!
echo ========================================
echo.
echo New Features:
echo   📷 QR Code Scanner - Scan to pay
echo   📱 QR Code Generator - Show your QR
echo   💸 Quick Actions - Easy access
echo.
echo Test the features:
echo   1. Tap "My QR" to see your payment QR
echo   2. Tap "Scan QR" to scan and pay
echo   3. Share your QR with friends
echo.
pause
