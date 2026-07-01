# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install all deps (devDeps needed for tsc)
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: production image ─────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies in a clean layer
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

EXPOSE 4000
ENV PORT=4000

CMD ["node", "dist/index.js"]
