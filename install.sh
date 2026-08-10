#!/usr/bin/env bash
# ============================================================================
# Celestial English Golden Retrievers — one-command VPS installer
#
# On a fresh Ubuntu VPS (Contabo or similar), run:
#
#   curl -fsSL https://raw.githubusercontent.com/PaddyJay-afk/dog-breeding-site-/main/install.sh | sudo bash
#
# Or with your domain pre-set (recommended):
#
#   curl -fsSL https://raw.githubusercontent.com/PaddyJay-afk/dog-breeding-site-/main/install.sh | sudo SITE_DOMAIN=yourdomain.com ADMIN_EMAIL=you@example.com bash
#
# What it does:
#   1. Installs Docker + Docker Compose (if missing)
#   2. Clones this repository to /opt/celestial-goldens
#   3. Generates strong random secrets into .env (never committed)
#   4. Builds and starts the full stack (app + PostgreSQL + Caddy HTTPS)
#   5. Seeds the database with the admin login + sample content on first boot
#
# Afterwards: https://yourdomain.com  (admin at /admin — credentials printed below)
# Safe to re-run: it updates the code and restarts the stack without data loss.
# ============================================================================
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/PaddyJay-afk/dog-breeding-site-.git}"
# Default to the branch that carries the site. Override with BRANCH=main after merging.
BRANCH="${BRANCH:-claude/golden-retriever-breeder-site-05257a}"
INSTALL_DIR="${INSTALL_DIR:-/opt/celestial-goldens}"
SITE_DOMAIN="${SITE_DOMAIN:-}"
ADMIN_EMAIL="${ADMIN_EMAIL:-}"

say()  { printf '\033[1;32m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!!\033[0m %s\n' "$*"; }
die()  { printf '\033[1;31mxx\033[0m %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Run as root (use sudo)."
command -v curl >/dev/null || die "curl is required."

# Private repo support: pass GITHUB_TOKEN=<personal access token with repo read>
# and the clone/pull will authenticate automatically.
if [ -n "${GITHUB_TOKEN:-}" ] && printf '%s' "$REPO_URL" | grep -q '^https://github.com/'; then
  REPO_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${REPO_URL#https://github.com/}"
fi

# --- 1. Docker --------------------------------------------------------------
if ! command -v docker >/dev/null 2>&1; then
  say "Installing Docker..."
  export DEBIAN_FRONTEND=noninteractive
  # Works on Ubuntu and Debian (both offered by Contabo).
  DISTRO_ID="$(. /etc/os-release && echo "$ID")"
  DISTRO_CODENAME="$(. /etc/os-release && echo "$VERSION_CODENAME")"
  case "$DISTRO_ID" in
    ubuntu|debian) : ;;
    *) die "Unsupported distro '$DISTRO_ID' — this installer supports Ubuntu and Debian." ;;
  esac
  apt-get update -qq
  apt-get install -y -qq ca-certificates curl git gnupg >/dev/null
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL "https://download.docker.com/linux/$DISTRO_ID/gpg" | gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/$DISTRO_ID $DISTRO_CODENAME stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin >/dev/null
  systemctl enable --now docker
else
  say "Docker already installed."
fi
command -v git >/dev/null || { apt-get update -qq; apt-get install -y -qq git >/dev/null; }

# --- 2. Code ---------------------------------------------------------------
if [ -d "$INSTALL_DIR/.git" ]; then
  say "Updating existing install in $INSTALL_DIR..."
  git -C "$INSTALL_DIR" fetch origin "$BRANCH" --quiet
  git -C "$INSTALL_DIR" checkout "$BRANCH" --quiet
  git -C "$INSTALL_DIR" pull origin "$BRANCH" --quiet
else
  say "Cloning repository to $INSTALL_DIR..."
  git clone --branch "$BRANCH" --depth 1 "$REPO_URL" "$INSTALL_DIR" --quiet
fi
cd "$INSTALL_DIR"

# --- 3. Configuration --------------------------------------------------------
if [ ! -f .env ]; then
  say "Creating .env with generated secrets..."

  if [ -z "$SITE_DOMAIN" ] && [ -t 0 ]; then
    read -rp "Domain for the site (e.g. celestialgoldens.com), or blank for IP-only test mode: " SITE_DOMAIN || true
  fi
  if [ -z "$ADMIN_EMAIL" ] && [ -t 0 ]; then
    read -rp "Admin login email for Pam [pam@example.com]: " ADMIN_EMAIL || true
  fi
  ADMIN_EMAIL="${ADMIN_EMAIL:-pam@example.com}"

  PAYLOAD_SECRET="$(openssl rand -base64 48 | tr -d '\n')"
  POSTGRES_PASSWORD="$(openssl rand -hex 24)"
  ADMIN_PASSWORD="$(openssl rand -base64 18 | tr -dc 'A-Za-z0-9' | head -c 16)"

  if [ -n "$SITE_DOMAIN" ]; then
    PUBLIC_URL="https://$SITE_DOMAIN"
  else
    # IP-only test mode: Caddy serves plain HTTP on port 80.
    #
    # The site address is pinned to the detected IP rather than a catch-all
    # ":80" on purpose. A catch-all serves every Host header, and in this mode
    # Payload derives its own base URL from the request (see the serverURL note
    # in src/payload.config.ts) — so a request carrying `Host: evil.example`
    # would make password-reset emails link to the attacker's site. Pinning the
    # host means only the real address is ever served, and any other Host gets
    # rejected by Caddy before it reaches the app.
    SERVER_IP="$(curl -fsS -4 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')"
    [ -n "$SERVER_IP" ] || die "Could not determine this server's public IP. Re-run with SITE_DOMAIN=yourdomain.com."
    SITE_DOMAIN="http://$SERVER_IP"
    PUBLIC_URL="http://$SERVER_IP"
    warn "No domain given — running in HTTP test mode at $PUBLIC_URL"
    warn "Re-run with SITE_DOMAIN=yourdomain.com once DNS is pointed here for automatic HTTPS."
  fi

  cat > .env <<ENV
# Generated by install.sh $(date -u +%FT%TZ) — do not commit.
PAYLOAD_SECRET=$PAYLOAD_SECRET
POSTGRES_DB=breeder
POSTGRES_USER=breeder
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
DATABASE_URI=postgres://breeder:$POSTGRES_PASSWORD@db:5432/breeder
SITE_DOMAIN=$SITE_DOMAIN
NEXT_PUBLIC_SERVER_URL=$PUBLIC_URL
CADDY_TLS_EMAIL=$ADMIN_EMAIL
AUTO_SEED=true
SEED_ADMIN_EMAIL=$ADMIN_EMAIL
SEED_ADMIN_PASSWORD=$ADMIN_PASSWORD
# Optional integrations — fill in later if wanted (see .env.example):
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=
EMAIL_TO_BREEDER=$ADMIN_EMAIL
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
S3_ENABLED=false
ENV
  chmod 600 .env
  FIRST_INSTALL=1
else
  say "Keeping existing .env (delete it to regenerate secrets)."
  FIRST_INSTALL=0
fi

# --- 4. Launch ----------------------------------------------------------------
say "Building and starting the stack (first build takes a few minutes)..."
docker compose up -d --build

say "Waiting for the app to come up..."
for i in $(seq 1 60); do
  if docker compose exec -T app sh -c 'exit 0' 2>/dev/null && \
     curl -fsS -o /dev/null "http://127.0.0.1:80" 2>/dev/null; then break; fi
  sleep 3
done

# --- 5. Done -------------------------------------------------------------------
PUBLIC_URL="$(grep '^NEXT_PUBLIC_SERVER_URL=' .env | cut -d= -f2-)"
echo
say "──────────────────────────────────────────────────────────"
say " Install complete."
say ""
say "   Website:   $PUBLIC_URL"
say "   Admin:     $PUBLIC_URL/admin"
if [ "$FIRST_INSTALL" = "1" ]; then
  say "   Login:     $(grep '^SEED_ADMIN_EMAIL=' .env | cut -d= -f2-)"
  say "   Password:  $(grep '^SEED_ADMIN_PASSWORD=' .env | cut -d= -f2-)"
  say ""
  say "   ⚠  Change this password after first login (Admin → Users)."
fi
say ""
say "   Logs:      cd $INSTALL_DIR && docker compose logs -f app"
say "   Update:    re-run this installer, or: git pull && docker compose up -d --build"
say "──────────────────────────────────────────────────────────"
