@echo off
REM PayApp - Clean + Full Rebuild
REM Use this when the normal build-apk.bat fails with Gradle cache errors.

echo ========================================
echo   PayApp - Clean Build
echo ========================================

set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%

echo.
echo [1/3] Stopping Gradle daemons...
pushd mobile\android
call gradlew.bat --stop 2>nul
popd

echo.
echo [2/3] Clearing Gradle caches...
if exist "%USERPROFILE%\.gradle\caches\8.6" (
    rmdir /s /q "%USERPROFILE%\.gradle\caches\8.6"
    echo Cleared .gradle\caches\8.6
)
if exist "mobile\android\.gradle" (
    rmdir /s /q "mobile\android\.gradle"
    echo Cleared android\.gradle
)
if exist "mobile\android\app\build" (
    rmdir /s /q "mobile\android\app\build"
    echo Cleared app\build
)
if exist "mobile\node_modules\@react-native\gradle-plugin\.gradle" (
    rmdir /s /q "mobile\node_modules\@react-native\gradle-plugin\.gradle"
    echo Cleared gradle-plugin\.gradle
)

echo.
echo [3/3] Running full build...
call build-apk.bat
