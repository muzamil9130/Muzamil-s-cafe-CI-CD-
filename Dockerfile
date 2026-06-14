# ─────────────────────────────────────────────────────────────
# Stage 1 – Dependencies
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ─────────────────────────────────────────────────────────────
# Stage 2 – Builder  (install ALL deps so TS / Vite are available)
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the Vite/React frontend → dist/
RUN npm run build

# Compile the Express server (server.ts → server.js)
RUN npx esbuild server.ts \
      --bundle \
      --platform=node \
      --target=node20 \
      --format=esm \
      --packages=external \
      --outfile=server.js

# ─────────────────────────────────────────────────────────────
# Stage 3 – Production image (lean)
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy only production node_modules
COPY --from=deps /app/node_modules ./node_modules

# Copy built artefacts
COPY --from=builder /app/dist      ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/package.json ./package.json

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
