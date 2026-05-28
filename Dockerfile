# ═══════════════════════════════════════════════════════════════════════
# SSVM College Square — All-in-One Application Container
# Frontend (Next.js) + Backend (Express.js) in a single container
# ═══════════════════════════════════════════════════════════════════════

FROM node:20-alpine AS base

# ═══════════════════════════════════════════════════════════════════════
# Stage 1: Build Backend
# ═══════════════════════════════════════════════════════════════════════
FROM base AS backend-builder

WORKDIR /backend

# Install backend dependencies
COPY ssvm-backend/package.json ssvm-backend/package-lock.json* ./
RUN npm ci --prefer-offline --no-audit

# Generate Prisma client
COPY ssvm-backend/prisma ./prisma/
RUN npx prisma generate

# Build TypeScript
COPY ssvm-backend/tsconfig.json ./
COPY ssvm-backend/src ./src/
RUN npx tsc

# ═══════════════════════════════════════════════════════════════════════
# Stage 2: Build Frontend
# ═══════════════════════════════════════════════════════════════════════
FROM base AS frontend-builder

WORKDIR /frontend

# Install frontend dependencies
COPY ssvm-platform/package.json ssvm-platform/package-lock.json* ./
RUN npm ci --prefer-offline --no-audit

# Copy frontend source
COPY ssvm-platform/ ./

# Build Next.js (standalone mode)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://localhost:5000

RUN npm run build

# ═══════════════════════════════════════════════════════════════════════
# Stage 3: Production Runtime — Frontend + Backend Together
# ═══════════════════════════════════════════════════════════════════════
FROM base AS production

LABEL maintainer="SSVM College Square"
LABEL description="Application Container — Next.js + Express.js (Frontend + Backend)"

# Install required tools
RUN apk add --no-cache \
    supervisor \
    bash \
    wget \
    curl

WORKDIR /app

# ─────────────────────────────────────────────────────────────────────
# Setup Backend
# ─────────────────────────────────────────────────────────────────────
WORKDIR /app/backend

# Copy backend production dependencies
COPY ssvm-backend/package.json ssvm-backend/package-lock.json* ./
RUN npm ci --prefer-offline --no-audit

# Copy Prisma schema
COPY ssvm-backend/prisma ./prisma/
RUN npx prisma generate

# Install tsx for seed script
RUN npm install -g tsx

# Copy compiled backend code
COPY --from=backend-builder /backend/dist ./dist/

# Create uploads directory
RUN mkdir -p ./uploads/gallery

# ─────────────────────────────────────────────────────────────────────
# Setup Frontend
# ─────────────────────────────────────────────────────────────────────
WORKDIR /app/frontend

# Copy Next.js standalone build
COPY --from=frontend-builder /frontend/public ./public
COPY --from=frontend-builder /frontend/.next/standalone ./
COPY --from=frontend-builder /frontend/.next/static ./.next/static

# ─────────────────────────────────────────────────────────────────────
# Setup Supervisor Configuration
# ─────────────────────────────────────────────────────────────────────
WORKDIR /app

# Create supervisor config
RUN mkdir -p /var/log/supervisor

COPY <<EOF /etc/supervisord.conf
[supervisord]
nodaemon=true
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid
loglevel=info

[program:backend]
command=node /app/backend/dist/index.js
directory=/app/backend
autostart=true
autorestart=true
priority=10
startsecs=5
stdout_logfile=/var/log/supervisor/backend.log
stderr_logfile=/var/log/supervisor/backend-error.log
stdout_logfile_maxbytes=10MB
stderr_logfile_maxbytes=10MB
environment=NODE_ENV="production",PORT="5000",DATABASE_URL="%(ENV_DATABASE_URL)s",JWT_SECRET="%(ENV_JWT_SECRET)s",JWT_EXPIRES_IN="%(ENV_JWT_EXPIRES_IN)s",FRONTEND_URL="http://localhost:3000",UPLOAD_DIR="/app/backend/uploads"

[program:frontend]
command=node /app/frontend/server.js
directory=/app/frontend
autostart=true
autorestart=true
priority=20
startsecs=5
stdout_logfile=/var/log/supervisor/frontend.log
stderr_logfile=/var/log/supervisor/frontend-error.log
stdout_logfile_maxbytes=10MB
stderr_logfile_maxbytes=10MB
environment=NODE_ENV="production",PORT="3000",HOSTNAME="0.0.0.0",NEXT_PUBLIC_API_URL="http://localhost:5000"
EOF

# ─────────────────────────────────────────────────────────────────────
# Entrypoint Script
# ─────────────────────────────────────────────────────────────────────
COPY <<'EOF' /app/entrypoint.sh
#!/bin/bash
set -e

echo "══════════════════════════════════════════════════════════════"
echo "  SSVM Application Container Starting"
echo "  Frontend (Next.js) + Backend (Express.js)"
echo "══════════════════════════════════════════════════════════════"

cd /app/backend

# Wait for database to be ready and sync schema
echo "⏳  Waiting for database connection..."
for i in {1..30}; do
    if npx prisma db push 2>/dev/null; then
        echo "✅  Database connected and schema synced."
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌  Database connection failed after 30 attempts."
        exit 1
    fi
    echo "    Attempt $i/30 — retrying in 2s..."
    sleep 2
done

# Check if database needs seeding
echo "🌱  Checking if database needs seeding..."
SEED_CHECK=$(npx prisma db execute --schema=prisma/schema.prisma --stdin <<SQL
SELECT COUNT(*) as count FROM "users";
SQL
2>/dev/null | grep -o '[0-9]*' | head -1)

if [ -z "$SEED_CHECK" ] || [ "$SEED_CHECK" = "0" ]; then
    echo "🌱  Database is empty — running seed script..."
    npx tsx prisma/seed.ts
    echo "✅  Seed completed."
else
    echo "✅  Database already has data, skipping seed."
fi

echo "══════════════════════════════════════════════════════════════"
echo "🚀  Starting Frontend + Backend via supervisord"
echo "    Backend API: http://localhost:5000"
echo "    Frontend:    http://localhost:3000"
echo "══════════════════════════════════════════════════════════════"

# Start supervisord
exec supervisord -c /etc/supervisord.conf
EOF

RUN dos2unix /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Expose ports
EXPOSE 3000 5000

# Health check (check both services)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health && \
      wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
