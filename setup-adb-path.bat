@echo off
echo ========================================
echo Setting up ADB in System PATH
echo ========================================
echo.

REM Get Android SDK path
set "ANDROID_SDK=%LOCALAPPDATA%\Android\Sdk"

REM Check if Android SDK exists
if not exist "%ANDROID_SDK%" (
    echo [ERROR] Android SDK not found at: %ANDROID_SDK%
    echo Please install Android Studio first.
    pause
    exit /b 1
)

REM Check if platform-tools exists
if not exist "%ANDROID_SDK%\platform-tools" (
    echo [ERROR] platform-tools not found!
    echo Please install Android SDK Platform-Tools from Android Studio.
    pause
    exit /b 1
)

echo [OK] Android SDK found at: %ANDROID_SDK%
echo.

REM Add to PATH for current session
set "PATH=%PATH%;%ANDROID_SDK%\platform-tools"
echo [OK] ADB added to PATH for current session
echo.

REM Add to User PATH permanently
echo Adding ADB to User PATH permanently...
setx PATH "%PATH%;%ANDROID_SDK%\platform-tools"

echo.
echo ========================================
echo SUCCESS!
echo ========================================
echo ADB has been added to your PATH.
echo.
echo Please RESTART your terminal/command prompt for changes to take effect.
echo.
echo After restart, you can use:
echo   adb devices
echo   adb install app.apk
echo   etc.
echo ========================================
echo.

REM Test ADB in current session
echo Testing ADB in current session:
"%ANDROID_SDK%\platform-tools\adb.exe" version
echo.

pause
