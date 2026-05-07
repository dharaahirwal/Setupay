# Setup ADB in System PATH
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setting up ADB in System PATH" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get Android SDK path
$androidSdk = "$env:LOCALAPPDATA\Android\Sdk"
$platformTools = "$androidSdk\platform-tools"

# Check if Android SDK exists
if (-not (Test-Path $androidSdk)) {
    Write-Host "[ERROR] Android SDK not found at: $androidSdk" -ForegroundColor Red
    Write-Host "Please install Android Studio first." -ForegroundColor Yellow
    pause
    exit 1
}

# Check if platform-tools exists
if (-not (Test-Path $platformTools)) {
    Write-Host "[ERROR] platform-tools not found!" -ForegroundColor Red
    Write-Host "Please install Android SDK Platform-Tools from Android Studio." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "[OK] Android SDK found at: $androidSdk" -ForegroundColor Green
Write-Host ""

# Get current User PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")

# Check if already in PATH
if ($currentPath -like "*$platformTools*") {
    Write-Host "[INFO] ADB is already in your PATH!" -ForegroundColor Yellow
} else {
    Write-Host "Adding ADB to User PATH permanently..." -ForegroundColor Cyan
    
    # Add to User PATH
    $newPath = "$currentPath;$platformTools"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    
    Write-Host "[OK] ADB added to User PATH!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUCCESS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "ADB has been added to your PATH." -ForegroundColor Green
Write-Host ""
Write-Host "Please RESTART your terminal/PowerShell for changes to take effect." -ForegroundColor Yellow
Write-Host ""
Write-Host "After restart, you can use:" -ForegroundColor Cyan
Write-Host "  adb devices" -ForegroundColor White
Write-Host "  adb install app.apk" -ForegroundColor White
Write-Host "  adb logcat" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test ADB in current session
Write-Host "Testing ADB in current session:" -ForegroundColor Cyan
& "$platformTools\adb.exe" version
Write-Host ""

# Add to current session PATH
$env:Path += ";$platformTools"
Write-Host "[OK] ADB also added to current session PATH" -ForegroundColor Green
Write-Host "You can use 'adb' commands in THIS window now!" -ForegroundColor Green
Write-Host ""

pause
