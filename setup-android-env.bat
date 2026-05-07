@echo off
echo ========================================
echo Android Development Environment Setup
echo ========================================
echo.

REM Define paths
set "ANDROID_SDK=%LOCALAPPDATA%\Android\Sdk"
set "PLATFORM_TOOLS=%ANDROID_SDK%\platform-tools"
set "CMDLINE_TOOLS=%ANDROID_SDK%\cmdline-tools\latest\bin"
set "BUILD_TOOLS=%ANDROID_SDK%\build-tools"
set "NDK=%ANDROID_SDK%\ndk"

echo Checking Android SDK components...
echo.

REM Check Android SDK
if not exist "%ANDROID_SDK%" (
    echo [ERROR] Android SDK not found at: %ANDROID_SDK%
    echo Please install Android Studio first.
    pause
    exit /b 1
)

echo [OK] Android SDK found at: %ANDROID_SDK%

REM Check platform-tools
if exist "%PLATFORM_TOOLS%" (
    echo [OK] Platform Tools found (adb, fastboot)
) else (
    echo [WARNING] Platform Tools not found
)

REM Check cmdline-tools
if exist "%CMDLINE_TOOLS%" (
    echo [OK] Command Line Tools found
) else (
    echo [WARNING] Command Line Tools not found
)

REM Check build-tools
if exist "%BUILD_TOOLS%" (
    echo [OK] Build Tools found
) else (
    echo [WARNING] Build Tools not found
)

REM Check NDK
if exist "%NDK%" (
    echo [OK] NDK found
    REM Set ANDROID_NDK_HOME
    for /f "delims=" %%i in ('dir /b /ad /o-n "%NDK%" 2^>nul') do (
        set "NDK_PATH=%NDK%\%%i"
        goto :ndk_found
    )
    :ndk_found
    setx ANDROID_NDK_HOME "%NDK_PATH%" >nul
    echo [OK] ANDROID_NDK_HOME set
) else (
    echo [WARNING] NDK not found
)

echo.
echo Setting environment variables...

REM Set ANDROID_HOME and ANDROID_SDK_ROOT
setx ANDROID_HOME "%ANDROID_SDK%" >nul
setx ANDROID_SDK_ROOT "%ANDROID_SDK%" >nul
echo [OK] ANDROID_HOME set to: %ANDROID_SDK%
echo [OK] ANDROID_SDK_ROOT set to: %ANDROID_SDK%

echo.
echo Adding paths to User PATH...

REM Get current PATH
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USER_PATH=%%b"

REM Add platform-tools
if exist "%PLATFORM_TOOLS%" (
    echo %USER_PATH% | find /i "%PLATFORM_TOOLS%" >nul
    if errorlevel 1 (
        set "USER_PATH=%USER_PATH%;%PLATFORM_TOOLS%"
        echo [ADD] Platform Tools
    ) else (
        echo [SKIP] Platform Tools already in PATH
    )
)

REM Add cmdline-tools
if exist "%CMDLINE_TOOLS%" (
    echo %USER_PATH% | find /i "%CMDLINE_TOOLS%" >nul
    if errorlevel 1 (
        set "USER_PATH=%USER_PATH%;%CMDLINE_TOOLS%"
        echo [ADD] Command Line Tools
    ) else (
        echo [SKIP] Command Line Tools already in PATH
    )
)

REM Add build-tools (latest version)
if exist "%BUILD_TOOLS%" (
    for /f "delims=" %%i in ('dir /b /ad /o-n "%BUILD_TOOLS%" 2^>nul') do (
        set "BUILD_TOOLS_PATH=%BUILD_TOOLS%\%%i"
        goto :build_tools_found
    )
    :build_tools_found
    echo %USER_PATH% | find /i "%BUILD_TOOLS_PATH%" >nul
    if errorlevel 1 (
        set "USER_PATH=%USER_PATH%;%BUILD_TOOLS_PATH%"
        echo [ADD] Build Tools
    ) else (
        echo [SKIP] Build Tools already in PATH
    )
)

REM Update PATH
setx PATH "%USER_PATH%" >nul

echo.
echo ========================================
echo Environment Variables Set:
echo ========================================
echo ANDROID_HOME       = %ANDROID_SDK%
echo ANDROID_SDK_ROOT   = %ANDROID_SDK%
if defined NDK_PATH echo ANDROID_NDK_HOME   = %NDK_PATH%

echo.
echo ========================================
echo Available Commands (after restart):
echo ========================================
echo adb devices              - List connected devices
echo adb install app.apk      - Install APK
echo adb logcat               - View device logs
echo fastboot devices         - List devices in fastboot mode
echo sdkmanager --list        - List SDK packages
echo avdmanager list avd      - List virtual devices
echo aapt                     - Android Asset Packaging Tool
echo zipalign                 - Optimize APK
echo apksigner                - Sign APK

echo.
echo ========================================
echo Gradle Commands:
echo ========================================
echo cd mobile\android
echo gradlew assembleRelease    - Build release APK
echo gradlew assembleDebug      - Build debug APK
echo gradlew clean              - Clean build
echo gradlew tasks              - List all tasks

echo.
echo ========================================
echo IMPORTANT!
echo ========================================
echo Please RESTART your terminal/command prompt
echo for PATH changes to take effect.
echo.
echo For current session, setting environment variables...

REM Set for current session
set "PATH=%PATH%;%PLATFORM_TOOLS%"
if exist "%CMDLINE_TOOLS%" set "PATH=%PATH%;%CMDLINE_TOOLS%"
if defined BUILD_TOOLS_PATH set "PATH=%PATH%;%BUILD_TOOLS_PATH%"
set "ANDROID_HOME=%ANDROID_SDK%"
set "ANDROID_SDK_ROOT=%ANDROID_SDK%"
if defined NDK_PATH set "ANDROID_NDK_HOME=%NDK_PATH%"

echo [OK] Environment variables set for current session!
echo.

echo ========================================
echo Testing Commands:
echo ========================================
echo.

echo ADB Version:
"%PLATFORM_TOOLS%\adb.exe" version
echo.

echo Connected Devices:
"%PLATFORM_TOOLS%\adb.exe" devices
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.

pause
