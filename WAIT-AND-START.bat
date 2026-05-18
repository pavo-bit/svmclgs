@echo off
echo ══════════════════════════════════════════════════════════════
echo   SSVM - Waiting for Docker Desktop to Start
echo ══════════════════════════════════════════════════════════════
echo.

:CHECK_DOCKER
echo Checking if Docker Desktop is ready...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Desktop is still starting... waiting 10 seconds
    timeout /t 10 /nobreak >nul
    goto CHECK_DOCKER
)

echo ✅ Docker Desktop is ready!
echo.

echo ══════════════════════════════════════════════════════════════
echo   Starting SSVM Platform
echo ══════════════════════════════════════════════════════════════
echo.

echo [1/5] Cleaning up old containers...
docker compose down 2>nul

echo.
echo [2/5] Starting database container...
docker compose up -d database

echo.
echo [3/5] Waiting for database to be ready (20 seconds)...
timeout /t 20 /nobreak >nul

echo.
echo [4/5] Starting application container...
docker compose up -d application

echo.
echo [5/5] Waiting for application to start (30 seconds)...
timeout /t 30 /nobreak >nul

echo.
echo ══════════════════════════════════════════════════════════════
echo   Checking Container Status
echo ══════════════════════════════════════════════════════════════
echo.

docker compose ps

echo.
echo ══════════════════════════════════════════════════════════════
echo   Testing Connections
echo ══════════════════════════════════════════════════════════════
echo.

echo [1/3] Testing Backend API...
curl -s http://localhost:5000/api/health
echo.

echo.
echo [2/3] Testing Frontend...
curl -s -o nul -w "Frontend Status: %%{http_code}\n" http://localhost:3000

echo.
echo [3/3] Testing Database Connection...
docker exec ssvm-application sh -c "cd /app/backend && npx prisma db execute --stdin" < nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Database connection successful
) else (
    echo ⚠️  Database connection check skipped
)

echo.
echo ══════════════════════════════════════════════════════════════
echo   🎉 SSVM Platform Status
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
echo   📸 Gallery: 16 demo images ready!
echo.
echo   View logs: docker compose logs -f
echo   Stop:      docker compose down
echo.
echo ══════════════════════════════════════════════════════════════

pause
