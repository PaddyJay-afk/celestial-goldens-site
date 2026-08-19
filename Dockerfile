# syntax=docker/dockerfile:1

# ---------- Base ----------
FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps
# Install all dependencies, including dev dependencies needed for the build.
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Builder ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# A dummy secret lets the config import during build; real secrets come at runtime.
ENV PAYLOAD_SECRET=build-time-placeholder
ENV NODE_ENV=production
RUN npm run build

# ---------- Runner ----------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as an unprivileged user.
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# Standalone server + assets only (small image).
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Seed assets are needed by the first-boot auto-seeder.
COPY --from=builder --chown=nextjs:nodejs /app/src/seed/assets ./seed-assets

# Persisted local uploads (mounted as a volume in compose).
ENV UPLOADS_DIR=/app/uploads
RUN mkdir -p /app/uploads/media /app/uploads/documents \
  && chown -R nextjs:nodejs /app/uploads

USER nextjs
EXPOSE 3000

# Database migrations run automatically on boot.
CMD ["node", "server.js"]
