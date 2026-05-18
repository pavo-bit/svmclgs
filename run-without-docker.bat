@echo off
REM ═══════════════════════════════════════════════════════════════
REM SSVM College Square — Run Without Docker (Windows)
REM Runs backend and frontend directly on your machine
REM ═══════════════════════════════════════════════════════════════

echo ════════════════════════════════════════════════════════════
echo   🚀 SSVM College Square — Local Development Mode
echo   (Running without Docker)
echo ════════════════════════════════════════════════════════════
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Recommended version: 20.x LTS
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version
echo.

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  PostgreSQL is not installed!
    echo.
    echo You have two options:
    echo   1. Install PostgreSQL from: https://www.postgresql.org/download/
    echo   2. Use SQLite instead (simpler, no installation needed)
    echo.
    choice /C 12 /M "Choose option"
    if errorlevel 2 goto USE_SQLITE
    if errorlevel 1 goto NEED_POSTGRES
)

:NEED_POSTGRES
echo.
echo Please install PostgreSQL and create a database:
echo   1. Download from: https://www.postgresql.org/download/windows/
echo   2. Install PostgreSQL
echo   3. Create database: ssvm_platform
echo   4. Update ssvm-backend/.env with your database credentials
echo.
pause
exit /b 1

:USE_SQLITE
echo.
echo 📝 Switching to SQLite (no PostgreSQL needed)...
echo.

REM Update backend .env to use SQLite
cd ssvm-backend
if exist .env.backup del .env.backup
if exist .env copy .env .env.backup
(
echo # ═══════════════════════════════════════════
echo # SSVM Backend — Environment Variables (SQLite)
echo # ═══════════════════════════════════════════
echo.
echo PORT=5000
echo.
echo # SQLite Database (no PostgreSQL needed)
echo DATABASE_URL="file:./dev.db"
echo.
echo # JWT
echo JWT_SECRET="ssvm-college-square-jwt-secret-2025-change-in-production"
echo JWT_EXPIRES_IN="7d"
echo.
echo # Frontend URL (for CORS)
echo FRONTEND_URL="http://localhost:3000"
echo.
echo # Upload folder
echo UPLOAD_DIR="./uploads"
) > .env

REM Update Prisma schema to use SQLite
if exist prisma\schema.prisma.backup del prisma\schema.prisma.backup
copy prisma\schema.prisma prisma\schema.prisma.backup

powershell -Command "(Get-Content prisma\schema.prisma) -replace 'provider = \"postgresql\"', 'provider = \"sqlite\"' | Set-Content prisma\schema.prisma"

echo ✅ Configured to use SQLite
cd ..

:SETUP_BACKEND
echo.
echo ════════════════════════════════════════════════════════════
echo   📦 Setting up Backend...
echo ════════════════════════════════════════════════════════════
echo.

cd ssvm-backend

REM Install dependencies if needed
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
)

REM Generate Prisma client
echo Generating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

REM Push database schema
echo Pushing database schema...
call npx prisma db push
if errorlevel 1 (
    echo ❌ Failed to push database schema
    pause
    exit /b 1
)

REM Seed database
echo Seeding database...
call npx tsx prisma/seed.ts
if errorlevel 1 (
    echo ⚠️  Database seeding failed (may already be seeded)
)

echo ✅ Backend setup complete
cd ..

:SETUP_FRONTEND
echo.
echo ════════════════════════════════════════════════════════════
echo   📦 Setting up Frontend...
echo ════════════════════════════════════════════════════════════
echo.

cd ssvm-platform

REM Install dependencies if needed
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

echo ✅ Frontend setup complete
cd ..

:START_SERVICES
echo.
echo ════════════════════════════════════════════════════════════
echo   🚀 Starting Services...
echo ════════════════════════════════════════════════════════════
echo.

REM Start backend in new window
echo Starting backend on http://localhost:5000...
start "SSVM Backend" cmd /k "cd ssvm-backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend in new window
echo Starting frontend on http://localhost:3000...
start "SSVM Frontend" cmd /k "cd ssvm-platform && npm run dev"

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
echo 🛑 To stop services:
echo    Close the backend and frontend terminal windows
echo.
echo 📝 Two new terminal windows have opened:
echo    - SSVM Backend (port 5000)
echo    - SSVM Frontend (port 3000)
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
