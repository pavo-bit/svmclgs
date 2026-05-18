@echo off
echo ══════════════════════════════════════════════════════════════
echo   Docker Desktop Status Checker
echo ══════════════════════════════════════════════════════════════
echo.

echo Checking Docker Desktop status...
echo.

docker ps >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker Desktop is READY!
    echo.
    echo Current containers:
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo.
    echo ══════════════════════════════════════════════════════════════
    echo   You can now run: docker compose up -d
    echo ══════════════════════════════════════════════════════════════
) else (
    echo ❌ Docker Desktop is NOT READY yet
    echo.
    echo Please wait for Docker Desktop to fully start.
    echo Look for the Docker icon in your system tray (bottom-right).
    echo It should be solid (not animated) when ready.
    echo.
    echo Then run this script again to check.
)

echo.
pause
