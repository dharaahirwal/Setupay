@echo off
echo ========================================
echo Verifying Render Configuration
echo ========================================
echo.

echo Checking render.yaml...
if exist render.yaml (
    echo [OK] render.yaml exists
    echo.
    echo Content:
    type render.yaml
    echo.
) else (
    echo [ERROR] render.yaml not found!
    exit /b 1
)

echo.
echo ========================================
echo Checking Git Status
echo ========================================
git log --oneline -1
echo.

echo ========================================
echo Checking Remote
echo ========================================
git remote -v
echo.

echo ========================================
echo NEXT STEPS:
echo ========================================
echo 1. Go to https://dashboard.render.com
echo 2. Find your setupay-backend service
echo 3. Click "Manual Deploy" -^> "Clear build cache & deploy"
echo 4. Or delete service and recreate (Render will auto-detect render.yaml)
echo.
echo See RENDER_TROUBLESHOOTING.md for detailed instructions
echo ========================================

pause
