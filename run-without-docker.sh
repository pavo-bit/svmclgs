#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# SSVM College Square — Run Without Docker (Linux/Mac)
# Runs backend and frontend directly on your machine
# ═══════════════════════════════════════════════════════════════

set -e

echo "════════════════════════════════════════════════════════════"
echo "  🚀 SSVM College Square — Local Development Mode"
echo "  (Running without Docker)"
echo "════════════════════════════════════════════════════════════"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Recommended version: 20.x LTS"
    exit 1
fi

echo "✅ Node.js is installed"
node --version
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed!"
    echo ""
    echo "You have two options:"
    echo "  1. Install PostgreSQL"
    echo "  2. Use SQLite instead (simpler, no installation needed)"
    echo ""
    read -p "Use SQLite? (y/n): " use_sqlite
    
    if [[ $use_sqlite == "y" || $use_sqlite == "Y" ]]; then
        echo ""
        echo "📝 Switching to SQLite (no PostgreSQL needed)..."
        echo ""
        
        # Update backend .env to use SQLite
        cd ssvm-backend
        cp .env .env.backup 2>/dev/null || true
        
        cat > .env << 'EOF'
# ═══════════════════════════════════════════
# SSVM Backend — Environment Variables (SQLite)
# ═══════════════════════════════════════════

PORT=5000

# SQLite Database (no PostgreSQL needed)
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="ssvm-college-square-jwt-secret-2025-change-in-production"
JWT_EXPIRES_IN="7d"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"

# Upload folder
UPLOAD_DIR="./uploads"
EOF
        
        # Update Prisma schema to use SQLite
        cp prisma/schema.prisma prisma/schema.prisma.backup
        sed -i.bak 's/provider = "postgresql"/provider = "sqlite"/' prisma/schema.prisma
        
        echo "✅ Configured to use SQLite"
        cd ..
    else
        echo ""
        echo "Please install PostgreSQL and create a database:"
        echo "  1. Install PostgreSQL"
        echo "  2. Create database: ssvm_platform"
        echo "  3. Update ssvm-backend/.env with your database credentials"
        exit 1
    fi
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  📦 Setting up Backend..."
echo "════════════════════════════════════════════════════════════"
echo ""

cd ssvm-backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push database schema
echo "Pushing database schema..."
npx prisma db push

# Seed database
echo "Seeding database..."
npx tsx prisma/seed.ts || echo "⚠️  Database seeding failed (may already be seeded)"

echo "✅ Backend setup complete"
cd ..

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  📦 Setting up Frontend..."
echo "════════════════════════════════════════════════════════════"
echo ""

cd ssvm-platform

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo "✅ Frontend setup complete"
cd ..

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  🚀 Starting Services..."
echo "════════════════════════════════════════════════════════════"
echo ""

# Create a trap to kill background processes on exit
trap 'kill $(jobs -p) 2>/dev/null' EXIT

# Start backend
echo "Starting backend on http://localhost:5000..."
cd ssvm-backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 5

# Start frontend
echo "Starting frontend on http://localhost:3000..."
cd ssvm-platform
npm run dev &
FRONTEND_PID=$!
cd ..

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
echo "🛑 To stop services: Press Ctrl+C"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Wait for user to press Ctrl+C
wait
