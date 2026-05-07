@echo off
echo ========================================
echo   Installing QR Code Dependencies
echo ========================================
echo.

cd mobile

echo [1/2] Installing npm packages...
call npm install react-native-qrcode-svg react-native-svg react-native-vision-camera vision-camera-code-scanner

if %ERRORLEVEL% NEQ 0 (
    echo [!] Failed to install packages
    cd ..
    pause
    exit /b 1
)

echo.
echo [2/2] Linking native modules...
cd android
call gradlew clean

cd ..\..

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Rebuild the APK:
echo      cd mobile\android
echo      gradlew assembleRelease
echo.
echo   2. Install on device:
echo      adb install -r app\build\outputs\apk\release\app-release.apk
echo.
pause
