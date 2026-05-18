#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# SSVM College Square — Quick Start Script
# Builds and starts both Docker containers
# ═══════════════════════════════════════════════════════════════

set -e

echo "════════════════════════════════════════════════════════════"
echo "  🚀 SSVM College Square — Docker Startup"
echo "════════════════════════════════════════════════════════════"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Stop any existing containers
echo "🧹 Cleaning up existing containers..."
docker compose down -v 2>/dev/null || true
echo ""

# Build and start containers
echo "🔨 Building and starting containers..."
echo "   This may take a few minutes on first run..."
echo ""
docker compose up -d --build

echo ""
echo "⏳ Waiting for services to be healthy..."
echo ""

# Wait for backend to be healthy
MAX_WAIT=120
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
    if docker compose ps | grep -q "ssvm-backend.*healthy"; then
        echo "✅ Backend is healthy"
        break
    fi
    if [ $WAITED -eq $MAX_WAIT ]; then
        echo "❌ Backend failed to start. Check logs with: docker compose logs backend"
        exit 1
    fi
    sleep 2
    WAITED=$((WAITED + 2))
    echo -n "."
done

echo ""

# Wait for frontend to be healthy
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
    if docker compose ps | grep -q "ssvm-frontend.*healthy"; then
        echo "✅ Frontend is healthy"
        break
    fi
    if [ $WAITED -eq $MAX_WAIT ]; then
        echo "❌ Frontend failed to start. Check logs with: docker compose logs frontend"
        exit 1
    fi
    sleep 2
    WAITED=$((WAITED + 2))
    echo -n "."
done

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  ✅ SSVM College Square is now running!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📱 Access the application:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:5000/api"
echo "   Health:    http://localhost:5000/api/health"
echo ""
echo "🔑 Login credentials:"
echo "   Admin:     admin@ssvm-cuttack.org   / admin123"
echo "   Student:   student@ssvm-cuttack.org / student123"
echo "   Parent:    parent@ssvm-cuttack.org  / parent123"
echo "   Alumni:    alumni@ssvm-cuttack.org  / alumni123"
echo ""
echo "📊 View logs:"
echo "   docker compose logs -f              # All services"
echo "   docker compose logs -f backend      # Backend only"
echo "   docker compose logs -f frontend     # Frontend only"
echo ""
echo "🛑 Stop services:"
echo "   docker compose down                 # Stop containers"
echo "   docker compose down -v              # Stop and remove data"
echo ""
echo "════════════════════════════════════════════════════════════"
