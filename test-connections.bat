@echo off
echo ══════════════════════════════════════════════════════════════
echo   SSVM Platform - Connection Test
echo ══════════════════════════════════════════════════════════════
echo.

echo [Step 1] Checking Docker Desktop...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop is not ready yet
    echo    Please wait for Docker Desktop to fully start
    echo    Then run this script again
    echo.
    pause
    exit /b 1
)
echo ✅ Docker Desktop is running
echo.

echo [Step 2] Checking containers status...
docker compose ps
echo.

echo [Step 3] Testing Database Container...
docker exec ssvm-database pg_isready -U postgres >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Database container is running and accepting connections
) else (
    echo ❌ Database container is not ready
    echo    It may still be starting up...
)
echo.

echo [Step 4] Testing Backend API...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend API is responding
    echo    Response:
    curl -s http://localhost:5000/api/health
) else (
    echo ❌ Backend API is not responding
    echo    Check if application container is running
)
echo.

echo [Step 5] Testing Frontend...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 > temp_status.txt 2>&1
set /p STATUS=<temp_status.txt
del temp_status.txt 2>nul
if "%STATUS%"=="200" (
    echo ✅ Frontend is responding (HTTP 200)
) else if "%STATUS%"=="000" (
    echo ❌ Frontend is not responding
    echo    Check if application container is running
) else (
    echo ⚠️  Frontend returned HTTP %STATUS%
)
echo.

echo [Step 6] Testing Gallery API...
curl -s http://localhost:5000/api/gallery >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Gallery API is responding
    echo    Checking image count...
    curl -s http://localhost:5000/api/gallery | findstr "\"id\"" | find /c "\"id\"" > temp_count.txt 2>&1
    set /p COUNT=<temp_count.txt
    del temp_count.txt 2>nul
    echo    Found images in database
) else (
    echo ❌ Gallery API is not responding
)
echo.

echo [Step 7] Testing Database Connection from Backend...
docker exec ssvm-application sh -c "cd /app/backend && npx prisma db execute --stdin <<< 'SELECT 1;'" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend can connect to database
) else (
    echo ⚠️  Could not verify backend-database connection
)
echo.

echo [Step 8] Checking Container Logs for Errors...
docker compose logs application 2>&1 | findstr /i "error failed" > temp_errors.txt 2>&1
for %%A in (temp_errors.txt) do set SIZE=%%~zA
if %SIZE% gtr 0 (
    echo ⚠️  Found some errors in logs:
    type temp_errors.txt | findstr /n "^" | findstr "1: 2: 3: 4: 5:"
) else (
    echo ✅ No critical errors found in logs
)
del temp_errors.txt 2>nul
echo.

echo ══════════════════════════════════════════════════════════════
echo   Connection Summary
echo ══════════════════════════════════════════════════════════════
echo.

docker compose ps | findstr "ssvm-database" | findstr "Up" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Database Container:  CONNECTED
) else (
    echo ❌ Database Container:  NOT RUNNING
)

docker compose ps | findstr "ssvm-application" | findstr "Up" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Application Container: CONNECTED
) else (
    echo ❌ Application Container: NOT RUNNING
)

curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend API:         CONNECTED (Port 5000)
) else (
    echo ❌ Backend API:         NOT RESPONDING
)

curl -s -o nul http://localhost:3000 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend:            CONNECTED (Port 3000)
) else (
    echo ❌ Frontend:            NOT RESPONDING
)

docker exec ssvm-database pg_isready -U postgres >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Database:            CONNECTED (Port 5432)
) else (
    echo ❌ Database:            NOT RESPONDING
)

echo.
echo ══════════════════════════════════════════════════════════════
echo   Network Connectivity
echo ══════════════════════════════════════════════════════════════
echo.

echo Testing if containers can communicate...
echo.

docker exec ssvm-application sh -c "ping -c 1 database" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Application → Database:  CAN COMMUNICATE
) else (
    echo ❌ Application → Database:  CANNOT COMMUNICATE
)

docker exec ssvm-application sh -c "nc -zv database 5432" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Application → Database Port 5432:  REACHABLE
) else (
    echo ⚠️  Application → Database Port 5432:  CHECK NEEDED
)

echo.
echo ══════════════════════════════════════════════════════════════
echo   URLs to Test
echo ══════════════════════════════════════════════════════════════
echo.
echo   Frontend:       http://localhost:3000
echo   Backend API:    http://localhost:5000/api/health
echo   Gallery API:    http://localhost:5000/api/gallery
echo   Admin Login:    http://localhost:3000/login
echo.
echo   Login: admin@ssvm-cuttack.org / admin123
echo.
echo ══════════════════════════════════════════════════════════════
echo.

pause
