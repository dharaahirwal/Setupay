@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   PayApp - Fast Build and Install
echo ========================================
echo.

REM ── Environment Setup ──────────────────────────────────────────────────────
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=C:\Users\dhara\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%

set MOBILE_DIR=mobile
set ANDROID_DIR=mobile\android
set APK_PATH=mobile\android\app\build\outputs\apk\release\app-release.apk
set KEYSTORE_PATH=mobile\android\app\payapp-release-key.keystore

echo [ENV] JAVA_HOME  = %JAVA_HOME%
echo [ENV] ANDROID_HOME = %ANDROID_HOME%
echo.

REM ── Step 1: Cleanup old APKs and stale Gradle caches ─────────────────────
echo [1/4] Cleanup...
del /S /F /Q "%MOBILE_DIR%\*.apk" >nul 2>&1
if exist "%ANDROID_DIR%\.gradle" rmdir /S /Q "%ANDROID_DIR%\.gradle" >nul 2>&1
if exist "%MOBILE_DIR%\node_modules\@react-native\gradle-plugin\.gradle" rmdir /S /Q "%MOBILE_DIR%\node_modules\@react-native\gradle-plugin\.gradle" >nul 2>&1
if exist "%MOBILE_DIR%\node_modules\@react-native\gradle-plugin\build" rmdir /S /Q "%MOBILE_DIR%\node_modules\@react-native\gradle-plugin\build" >nul 2>&1
echo       Done.
echo.

REM ── Step 2: Install JS dependencies ───────────────────────────────────────
echo [2/4] Checking JS dependencies...
cd %MOBILE_DIR%
call npm install --prefer-offline >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo       npm install failed - retrying with network...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [X] npm install failed!
        cd ..
        pause
        exit /b 1
    )
)
cd ..
echo       Done.
echo.

REM ── Step 3: Build Release APK ─────────────────────────────────────────────
echo [3/4] Building Release APK (this takes a few minutes)...
echo.
cd %ANDROID_DIR%
call gradlew.bat assembleRelease ^
    --no-daemon ^
    -Dorg.gradle.jvmargs="-Xmx4g -XX:MaxMetaspaceSize=512m" ^
    -Dorg.gradle.java.home="%JAVA_HOME%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [X] Build FAILED!
    cd ..\..
    pause
    exit /b 1
)
cd ..\..
echo.
echo [OK] Build completed successfully!
echo.

REM ── Step 4: Install on device (if connected) ──────────────────────────────
echo [4/4] Checking for connected device...

if not exist "%APK_PATH%" (
    echo [X] APK not found at: %APK_PATH%
    pause
    exit /b 1
)

echo [OK] APK ready: %APK_PATH%
echo.

adb devices > temp_devices.txt 2>nul
findstr /C:"device" temp_devices.txt | findstr /V /C:"List of devices" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Device detected - installing...
    adb install -r "%APK_PATH%"
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo [OK] SUCCESS! APK installed on device
        echo ========================================
    ) else (
        echo.
        echo [!] Install failed - check device for permission prompts
        echo     Enable "Install via USB" in Developer Options if needed.
    )
) else (
    echo [!] No device connected.
    echo     APK is at: %APK_PATH%
)

del temp_devices.txt 2>nul
echo.
pause
