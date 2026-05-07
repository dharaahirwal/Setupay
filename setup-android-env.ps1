# Complete Android Development Environment Setup
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Android Development Environment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define paths
$androidSdk = "$env:LOCALAPPDATA\Android\Sdk"
$platformTools = "$androidSdk\platform-tools"
$cmdlineTools = "$androidSdk\cmdline-tools\latest\bin"
$buildTools = "$androidSdk\build-tools"
$ndk = "$androidSdk\ndk"
$gradleHome = "$env:USERPROFILE\.gradle\wrapper\dists"

# Array to store paths to add
$pathsToAdd = @()

Write-Host "Checking Android SDK components..." -ForegroundColor Cyan
Write-Host ""

# Check Android SDK
if (Test-Path $androidSdk) {
    Write-Host "[OK] Android SDK found at: $androidSdk" -ForegroundColor Green
    
    # Check platform-tools (ADB, Fastboot)
    if (Test-Path $platformTools) {
        Write-Host "[OK] Platform Tools found (adb, fastboot)" -ForegroundColor Green
        $pathsToAdd += $platformTools
    } else {
        Write-Host "[WARNING] Platform Tools not found" -ForegroundColor Yellow
    }
    
    # Check cmdline-tools
    if (Test-Path $cmdlineTools) {
        Write-Host "[OK] Command Line Tools found (sdkmanager, avdmanager)" -ForegroundColor Green
        $pathsToAdd += $cmdlineTools
    } else {
        Write-Host "[WARNING] Command Line Tools not found" -ForegroundColor Yellow
    }
    
    # Check build-tools (latest version)
    if (Test-Path $buildTools) {
        $latestBuildTools = Get-ChildItem $buildTools | Sort-Object Name -Descending | Select-Object -First 1
        if ($latestBuildTools) {
            Write-Host "[OK] Build Tools found: $($latestBuildTools.Name)" -ForegroundColor Green
            $pathsToAdd += $latestBuildTools.FullName
        }
    } else {
        Write-Host "[WARNING] Build Tools not found" -ForegroundColor Yellow
    }
    
    # Check NDK (latest version)
    if (Test-Path $ndk) {
        $latestNdk = Get-ChildItem $ndk | Sort-Object Name -Descending | Select-Object -First 1
        if ($latestNdk) {
            Write-Host "[OK] NDK found: $($latestNdk.Name)" -ForegroundColor Green
            $ndkPath = $latestNdk.FullName
            # Set ANDROID_NDK_HOME environment variable
            [Environment]::SetEnvironmentVariable("ANDROID_NDK_HOME", $ndkPath, "User")
            Write-Host "[OK] ANDROID_NDK_HOME set to: $ndkPath" -ForegroundColor Green
        }
    } else {
        Write-Host "[WARNING] NDK not found" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "[ERROR] Android SDK not found at: $androidSdk" -ForegroundColor Red
    Write-Host "Please install Android Studio first." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""

# Set ANDROID_HOME environment variable
Write-Host "Setting environment variables..." -ForegroundColor Cyan
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidSdk, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $androidSdk, "User")
Write-Host "[OK] ANDROID_HOME set to: $androidSdk" -ForegroundColor Green
Write-Host "[OK] ANDROID_SDK_ROOT set to: $androidSdk" -ForegroundColor Green

Write-Host ""

# Check Gradle wrapper in project
$projectGradlew = ".\mobile\android\gradlew.bat"
if (Test-Path $projectGradlew) {
    Write-Host "[OK] Gradle wrapper found in project" -ForegroundColor Green
    Write-Host "    You can use: .\mobile\android\gradlew.bat" -ForegroundColor White
} else {
    Write-Host "[WARNING] Gradle wrapper not found in project" -ForegroundColor Yellow
}

Write-Host ""

# Get current User PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")

# Add paths to User PATH
Write-Host "Adding paths to User PATH..." -ForegroundColor Cyan
$pathsAdded = 0
$pathsSkipped = 0

foreach ($path in $pathsToAdd) {
    if ($currentPath -like "*$path*") {
        Write-Host "[SKIP] Already in PATH: $path" -ForegroundColor Yellow
        $pathsSkipped++
    } else {
        $currentPath += ";$path"
        Write-Host "[ADD] Adding to PATH: $path" -ForegroundColor Green
        $pathsAdded++
    }
}

# Update User PATH if changes were made
if ($pathsAdded -gt 0) {
    [Environment]::SetEnvironmentVariable("Path", $currentPath, "User")
    Write-Host ""
    Write-Host "[OK] $pathsAdded path(s) added to User PATH" -ForegroundColor Green
}

if ($pathsSkipped -gt 0) {
    Write-Host "[INFO] $pathsSkipped path(s) already in PATH" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Environment Variables Set:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ANDROID_HOME       = $androidSdk" -ForegroundColor White
Write-Host "ANDROID_SDK_ROOT   = $androidSdk" -ForegroundColor White

if (Test-Path $ndk) {
    $latestNdk = Get-ChildItem $ndk | Sort-Object Name -Descending | Select-Object -First 1
    if ($latestNdk) {
        Write-Host "ANDROID_NDK_HOME   = $($latestNdk.FullName)" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Available Commands (after restart):" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "adb devices              - List connected devices" -ForegroundColor White
Write-Host "adb install app.apk      - Install APK" -ForegroundColor White
Write-Host "adb logcat               - View device logs" -ForegroundColor White
Write-Host "fastboot devices         - List devices in fastboot mode" -ForegroundColor White
Write-Host "sdkmanager --list        - List SDK packages" -ForegroundColor White
Write-Host "avdmanager list avd      - List virtual devices" -ForegroundColor White

if (Test-Path $buildTools) {
    $latestBuildTools = Get-ChildItem $buildTools | Sort-Object Name -Descending | Select-Object -First 1
    if ($latestBuildTools) {
        Write-Host "aapt                     - Android Asset Packaging Tool" -ForegroundColor White
        Write-Host "zipalign                 - Optimize APK" -ForegroundColor White
        Write-Host "apksigner                - Sign APK" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Gradle Commands:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "cd mobile\android" -ForegroundColor White
Write-Host ".\gradlew assembleRelease    - Build release APK" -ForegroundColor White
Write-Host ".\gradlew assembleDebug      - Build debug APK" -ForegroundColor White
Write-Host ".\gradlew clean              - Clean build" -ForegroundColor White
Write-Host ".\gradlew tasks              - List all tasks" -ForegroundColor White

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "IMPORTANT!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Please RESTART your terminal/PowerShell" -ForegroundColor Yellow
Write-Host "for PATH changes to take effect." -ForegroundColor Yellow
Write-Host ""
Write-Host "For current session, paths are added below:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Add to current session PATH
foreach ($path in $pathsToAdd) {
    $env:Path += ";$path"
    Write-Host "[OK] $path" -ForegroundColor Green
}

# Set environment variables for current session
$env:ANDROID_HOME = $androidSdk
$env:ANDROID_SDK_ROOT = $androidSdk

if (Test-Path $ndk) {
    $latestNdk = Get-ChildItem $ndk | Sort-Object Name -Descending | Select-Object -First 1
    if ($latestNdk) {
        $env:ANDROID_NDK_HOME = $latestNdk.FullName
    }
}

Write-Host ""
Write-Host "[OK] Environment variables set for current session!" -ForegroundColor Green
Write-Host ""

# Test commands
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Commands:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "ADB Version:" -ForegroundColor Cyan
try {
    & adb version
    Write-Host "[OK] ADB is working!" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] ADB not working" -ForegroundColor Red
}

Write-Host ""
Write-Host "Connected Devices:" -ForegroundColor Cyan
try {
    & adb devices
} catch {
    Write-Host "[ERROR] Could not list devices" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

pause
