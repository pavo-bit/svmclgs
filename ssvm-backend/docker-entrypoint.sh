#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# SSVM Backend — Docker Entrypoint (All-in-One)
# 1. Initialize PostgreSQL
# 2. Start PostgreSQL
# 3. Create database
# 4. Run Prisma migrations & seed
# 5. Launch supervisord (manages both PostgreSQL + Express)
# ═══════════════════════════════════════════════════════════════

set -e

echo "══════════════════════════════════════════════════════"
echo "  SSVM Backend — All-in-One Container Starting"
echo "══════════════════════════════════════════════════════"

# ── Step 1: Initialize PostgreSQL if not already initialized ──
if [ ! -f "$PGDATA/PG_VERSION" ]; then
    echo "🔧  Initializing PostgreSQL database cluster..."
    su-exec postgres initdb -D "$PGDATA" --auth=trust --encoding=UTF8
    
    # Configure PostgreSQL to accept local connections
    echo "host all all 0.0.0.0/0 md5" >> "$PGDATA/pg_hba.conf"
    echo "local all all trust" >> "$PGDATA/pg_hba.conf"
    
    # Listen on all interfaces
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PGDATA/postgresql.conf"
    
    echo "✅  PostgreSQL initialized."
else
    echo "✅  PostgreSQL data directory already exists."
fi

# ── Step 2: Start PostgreSQL temporarily for setup ──
echo "🔄  Starting PostgreSQL for setup..."
mkdir -p /var/log/supervisor
chmod 777 /var/log/supervisor
su-exec postgres pg_ctl -D "$PGDATA" -l /var/log/supervisor/postgresql-init.log start -w

# Wait for PostgreSQL to be ready
echo "⏳  Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if su-exec postgres pg_isready -q; then
        echo "✅  PostgreSQL is ready."
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌  PostgreSQL failed to start in time."
        exit 1
    fi
    sleep 1
done

# ── Step 3: Create database and user if they don't exist ──
echo "🔧  Setting up database user and database..."

# Set password for postgres user
su-exec postgres psql -c "ALTER USER ${POSTGRES_USER} PASSWORD '${POSTGRES_PASSWORD}';" 2>/dev/null || true

# Create the database if it doesn't exist
su-exec postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '${POSTGRES_DB}'" | grep -q 1 || \
    su-exec postgres createdb -O "${POSTGRES_USER}" "${POSTGRES_DB}"

echo "✅  Database '${POSTGRES_DB}' is ready."

# ── Step 4: Run Prisma migrations ──
echo "🔄  Pushing Prisma schema to database..."
export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}"

# Generate Prisma client first
npx prisma generate

# Push schema
npx prisma db push --skip-generate --accept-data-loss
echo "✅  Schema pushed."

# ── Step 5: Seed if database is empty ──
echo "🌱  Checking if database needs seeding..."
USERS_COUNT=$(su-exec postgres psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -tAc "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")

if [ "$USERS_COUNT" = "0" ]; then
    echo "🌱  Database is empty — running seed script..."
    npx tsx prisma/seed.ts
    echo "✅  Seed completed."
else
    echo "✅  Database has $USERS_COUNT user(s), skipping seed."
fi

# ── Step 6: Stop temporary PostgreSQL (supervisord will manage it) ──
echo "🔄  Handing off to supervisord..."
su-exec postgres pg_ctl -D "$PGDATA" stop -w

# ── Step 7: Start supervisord (manages both PostgreSQL + Express) ──
echo "══════════════════════════════════════════════════════"
echo "🚀  Starting PostgreSQL + Express via supervisord"
echo "    PostgreSQL :5432  |  Express API :5000"
echo "══════════════════════════════════════════════════════"

# Start supervisord — it will launch both PostgreSQL and Express
exec supervisord -c /etc/supervisord.conf
