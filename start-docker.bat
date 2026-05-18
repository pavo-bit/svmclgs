@echo off
echo ══════════════════════════════════════════════════════════════
echo   SSVM College Square - Docker Startup Script
echo ══════════════════════════════════════════════════════════════
echo.

echo [1/4] Checking Docker Desktop...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop is not running!
    echo.
    echo Please start Docker Desktop and run this script again.
    echo.
    pause
    exit /b 1
)
echo ✅ Docker Desktop is running

echo.
echo [2/4] Stopping any existing containers...
docker compose down 2>nul

echo.
echo [3/4] Starting containers (this may take a moment)...
docker compose up -d

echo.
echo [4/4] Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ══════════════════════════════════════════════════════════════
echo   🎉 SSVM Platform is Starting!
echo ══════════════════════════════════════════════════════════════
echo.
echo   📱 Frontend:    http://localhost:3000
echo   🔌 Backend API: http://localhost:5000
echo   🗄️  Database:   localhost:5432
echo.
echo   📋 Login Credentials:
echo   ─────────────────────────────────────────────────────────────
echo   Admin:   admin@ssvm-cuttack.org   / admin123
echo   Student: student@ssvm-cuttack.org / student123
echo   Parent:  parent@ssvm-cuttack.org  / parent123
echo   Alumni:  alumni@ssvm-cuttack.org  / alumni123
echo   ─────────────────────────────────────────────────────────────
echo.
echo   📸 Gallery: 16 demo images pre-loaded!
echo   🎨 Admin can upload/delete photos from dashboard
echo.
echo   View logs: docker compose logs -f
echo   Stop:      docker compose down
echo.
echo ══════════════════════════════════════════════════════════════

pause
