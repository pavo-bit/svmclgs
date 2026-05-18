@echo off
REM ═══════════════════════════════════════════════════════════════
REM SSVM College Square — Quick Start Script (Windows)
REM Builds and starts both Docker containers
REM ═══════════════════════════════════════════════════════════════

echo ════════════════════════════════════════════════════════════
echo   🚀 SSVM College Square — Docker Startup
echo ════════════════════════════════════════════════════════════
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

echo ✅ Docker is running
echo.

REM Stop any existing containers
echo 🧹 Cleaning up existing containers...
docker compose down -v 2>nul
echo.

REM Build and start containers
echo 🔨 Building and starting containers...
echo    This may take a few minutes on first run...
echo.
docker compose up -d --build

echo.
echo ⏳ Waiting for services to be healthy...
echo    This may take 1-2 minutes...
echo.

REM Wait for services to start (simple timeout)
timeout /t 60 /nobreak >nul

echo.
echo ════════════════════════════════════════════════════════════
echo   ✅ SSVM College Square is now running!
echo ════════════════════════════════════════════════════════════
echo.
echo 📱 Access the application:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:5000/api
echo    Health:    http://localhost:5000/api/health
echo.
echo 🔑 Login credentials:
echo    Admin:     admin@ssvm-cuttack.org   / admin123
echo    Student:   student@ssvm-cuttack.org / student123
echo    Parent:    parent@ssvm-cuttack.org  / parent123
echo    Alumni:    alumni@ssvm-cuttack.org  / alumni123
echo.
echo 📊 View logs:
echo    docker compose logs -f              # All services
echo    docker compose logs -f backend      # Backend only
echo    docker compose logs -f frontend     # Frontend only
echo.
echo 🛑 Stop services:
echo    docker compose down                 # Stop containers
echo    docker compose down -v              # Stop and remove data
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
