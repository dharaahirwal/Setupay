@echo off
echo ========================================
echo   PayApp Backend Server
echo ========================================
echo.
echo Local IP: 172.21.232.45
echo Server URL: http://172.21.232.45:5000
echo API Base: http://172.21.232.45:5000/api
echo.

REM Check MongoDB
sc query MongoDB | findstr "RUNNING" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] MongoDB is not running
    echo     Attempting to start...
    net start MongoDB
    if %ERRORLEVEL% NEQ 0 (
        echo     [X] Failed to start MongoDB
        echo     Please start MongoDB manually
        pause
        exit /b 1
    )
    echo     MongoDB started ✓
    echo.
)

echo Starting backend server...
echo Press Ctrl+C to stop
echo.
cd backend
call npm run dev
