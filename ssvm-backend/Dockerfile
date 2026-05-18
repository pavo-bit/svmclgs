# ═══════════════════════════════════════════════════════════════
# SSVM Backend — Dockerfile
# ALL-IN-ONE: Express.js + Prisma + PostgreSQL in a single container
# Uses supervisord to manage both processes
# ═══════════════════════════════════════════════════════════════

# ── Stage 1: Build TypeScript ─────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Generate Prisma client
COPY prisma ./prisma/
RUN npx prisma generate

# Compile TypeScript
COPY tsconfig.json ./
COPY src ./src/
RUN npx tsc

# ── Stage 2: Production — Express + PostgreSQL together ──────
FROM node:20-alpine AS production

LABEL maintainer="SSVM College Square"
LABEL description="Backend Container — Express.js + Prisma + PostgreSQL 16 (all-in-one)"

# ── Install PostgreSQL 16 into the same container ──
RUN apk add --no-cache \
    postgresql16 \
    postgresql16-contrib \
    postgresql16-client \
    supervisor \
    su-exec \
    bash \
    wget \
    curl

# ── Set up PostgreSQL data directory ──
ENV PGDATA=/var/lib/postgresql/data
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=ssvm_platform

# Create PostgreSQL data directory with correct ownership
RUN mkdir -p "$PGDATA" /run/postgresql /var/log/supervisor && \
    chown -R postgres:postgres "$PGDATA" /run/postgresql && \
    chmod 700 "$PGDATA"

# ── Set up Node.js application ──
WORKDIR /app

# Install production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy Prisma schema (needed for migrations & seed)
COPY prisma ./prisma/
RUN npx prisma generate

# Install tsx globally (for seed script)
RUN npm install -g tsx

# Copy compiled JavaScript from builder
COPY --from=builder /app/dist ./dist/

# Copy entrypoint and supervisor config
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Create uploads directory
RUN mkdir -p /app/uploads/gallery

# ── Supervisord configuration ──
# Manages both PostgreSQL and Express.js processes
COPY supervisord.conf /etc/supervisord.conf

# Expose both ports
EXPOSE 5000
EXPOSE 5432

# Health check (checks Express API)
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start everything via entrypoint
ENTRYPOINT ["./docker-entrypoint.sh"]
