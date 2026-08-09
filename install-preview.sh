#!/usr/bin/env bash
# ============================================================================
# Celestial English Golden Retrievers — side-by-side preview installer
#
# Installs the feature/celestial-brand-upgrade branch beside the current live
# site, publishes the app on a localhost-only port, and adds a host Caddy route.
#
# Example:
#   curl -fsSL https://raw.githubusercontent.com/PaddyJay-afk/celestial-goldens-site/feature/celestial-brand-upgrade/install-preview.sh \
#     | sudo SITE_DOMAIN=celestial-preview.66.94.102.71.sslip.io APP_PORT=3024 bash
# ============================================================================
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/PaddyJay-afk/celestial-goldens-site.git}"
BRANCH="${BRANCH:-feature/celestial-brand-upgrade}"
INSTALL_DIR="${INSTALL_DIR:-/opt/celestial-goldens-preview}"
PROJECT_NAME="${PROJECT_NAME:-celestial-preview}"
SITE_DOMAIN="${SITE_DOMAIN:-celestial-preview.66.94.102.71.sslip.io}"
APP_PORT="${APP_PORT:-3024}"
ADMIN_EMAIL="${ADMIN_EMAIL:-patrick-preview-admin@example.com}"
CADDYFILE="${CADDYFILE:-/etc/caddy/Caddyfile}"

say()  { printf '\033[1;32m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!!\033[0m %s\n' "$*"; }
die()  { printf '\033[1;31mxx\033[0m %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Run as root, e.g. curl ... | sudo bash"
command -v git >/dev/null || die "git is required"
command -v docker >/dev/null || die "Docker is required"
docker compose version >/dev/null || die "Docker Compose plugin is required"
command -v caddy >/dev/null || die "This preview installer expects the host Caddy service to already exist"
[ -f "$CADDYFILE" ] || die "Caddyfile not found at $CADDYFILE"

if ! printf '%s' "$APP_PORT" | grep -Eq '^[0-9]+$'; then
  die "APP_PORT must be numeric"
fi

if ss -ltn "sport = :$APP_PORT" | grep -q LISTEN; then
  warn "Port $APP_PORT is already listening. If this is an existing preview install, continuing."
fi

# Private repo support: pass GITHUB_TOKEN=<token with repo read>.
CLONE_URL="$REPO_URL"
if [ -n "${GITHUB_TOKEN:-}" ] && printf '%s' "$REPO_URL" | grep -q '^https://github.com/'; then
  CLONE_URL="https://x-access-token:${GITHUB_TOKEN}@${REPO_URL#https://}"
fi

say "Installing preview branch $BRANCH into $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"
chown "${SUDO_USER:-$(id -un)}:${SUDO_USER:-$(id -un)}" "$INSTALL_DIR" 2>/dev/null || true

if [ -d "$INSTALL_DIR/.git" ]; then
  git -C "$INSTALL_DIR" fetch origin "$BRANCH" --quiet
  git -C "$INSTALL_DIR" checkout "$BRANCH" --quiet
  git -C "$INSTALL_DIR" reset --hard "origin/$BRANCH" --quiet
else
  rm -rf "$INSTALL_DIR"/*
  git clone --branch "$BRANCH" --depth 1 "$CLONE_URL" "$INSTALL_DIR" --quiet
fi
cd "$INSTALL_DIR"

if [ ! -f .env ]; then
  say "Creating preview .env with generated secrets"
  umask 077
  PAYLOAD_SECRET="$(openssl rand -base64 48 | tr -d '\n')"
  POSTGRES_PASSWORD="$(openssl rand -hex 24)"
  ADMIN_PASSWORD="$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 20)"
  cat > .env <<ENV
PAYLOAD_SECRET=$PAYLOAD_SECRET
POSTGRES_DB=breeder
POSTGRES_USER=breeder
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
DATABASE_URI=postgres://breeder:${POSTGRES_PASSWORD}@db:5432/breeder
SITE_DOMAIN=$SITE_DOMAIN
NEXT_PUBLIC_SERVER_URL=https://$SITE_DOMAIN
CADDY_TLS_EMAIL=$ADMIN_EMAIL
AUTO_SEED=true
SEED_ADMIN_EMAIL=$ADMIN_EMAIL
SEED_ADMIN_PASSWORD=$ADMIN_PASSWORD
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM="Celestial English Golden Retrievers <no-reply@example.com>"
EMAIL_TO_BREEDER=$ADMIN_EMAIL
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
S3_ENABLED=false
ENV
  chmod 600 .env
  FIRST_INSTALL=1
else
  say "Keeping existing preview .env"
  FIRST_INSTALL=0
fi

cat > docker-compose.preview.yml <<YAML
services:
  app:
    ports:
      - "127.0.0.1:${APP_PORT}:3000"
YAML

say "Building and starting Docker preview stack"
docker compose -p "$PROJECT_NAME" -f docker-compose.yml -f docker-compose.preview.yml up -d --build db app

say "Adding/updating Caddy route for https://$SITE_DOMAIN"
TS="$(date +%Y%m%d%H%M%S)"
cp "$CADDYFILE" "$CADDYFILE.bak.$TS"
install -o caddy -g caddy -m 0640 /dev/null "/var/log/caddy/${PROJECT_NAME}.log" 2>/dev/null || true

if ! grep -q "^${SITE_DOMAIN} " "$CADDYFILE"; then
  cat >> "$CADDYFILE" <<EOF

${SITE_DOMAIN} {
	reverse_proxy 127.0.0.1:${APP_PORT}

	encode zstd gzip

	header {
		Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
		X-Content-Type-Options "nosniff"
		X-Frame-Options "SAMEORIGIN"
		Referrer-Policy "strict-origin-when-cross-origin"
		-Server
	}

	log {
		output file /var/log/caddy/${PROJECT_NAME}.log
		format json
	}
}
EOF
else
  warn "$SITE_DOMAIN already exists in $CADDYFILE; leaving existing route unchanged."
fi

caddy validate --config "$CADDYFILE"
systemctl reload caddy

say "Waiting for preview app"
for _ in $(seq 1 60); do
  if curl -fsS -o /dev/null "http://127.0.0.1:${APP_PORT}/"; then
    break
  fi
  sleep 3
done

say "Preview installed"
printf '\nWebsite: https://%s\nAdmin:   https://%s/admin\n' "$SITE_DOMAIN" "$SITE_DOMAIN"
if [ "$FIRST_INSTALL" = "1" ]; then
  printf 'Login:   %s\n' "$ADMIN_EMAIL"
  printf 'Password is stored in: %s/.env as SEED_ADMIN_PASSWORD\n' "$INSTALL_DIR"
fi
printf 'Logs:    cd %s && docker compose -p %s -f docker-compose.yml -f docker-compose.preview.yml logs -f app\n' "$INSTALL_DIR" "$PROJECT_NAME"
