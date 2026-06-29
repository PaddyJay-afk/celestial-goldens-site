# Deployment — Contabo VPS (Ubuntu) with Docker Compose + Caddy

This guide deploys the full stack (Next.js app + PostgreSQL + Caddy HTTPS proxy)
to an Ubuntu VPS such as Contabo. Caddy obtains and renews TLS certificates
automatically.

---

## 1. Prerequisites

- A Contabo (or any) Ubuntu 22.04+ VPS with a public IP.
- A domain name with a DNS **A record** (and **AAAA** if you have IPv6) pointing
  to the VPS IP. HTTPS will not work until DNS resolves to the server.
- Ports **80** and **443** open in any firewall/security group.

---

## 2. Install Docker on the server

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl git
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

Optionally allow your user to run Docker without sudo:

```bash
sudo usermod -aG docker $USER   # then log out and back in
```

---

## 3. Get the code and configure secrets

```bash
git clone <YOUR_REPO_URL> cirilli-goldens
cd cirilli-goldens
cp .env.example .env
```

Edit `.env` and set, at minimum:

```env
PAYLOAD_SECRET=<openssl rand -base64 48>
POSTGRES_PASSWORD=<a strong random password>
SITE_DOMAIN=yourdomain.com
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
CADDY_TLS_EMAIL=you@yourdomain.com
```

Generate strong values:

```bash
openssl rand -base64 48   # PAYLOAD_SECRET
openssl rand -base64 24   # POSTGRES_PASSWORD
```

Configure email (recommended) and Stripe/S3 (optional) in the same file. Never
commit `.env`.

---

## 4. First deploy

```bash
docker compose up -d --build
```

This builds the app image and starts three services: `db`, `app`, `caddy`.

- The app runs its **database migrations automatically on first boot**, so the
  schema is created with no extra steps.
- Caddy requests a TLS certificate for `SITE_DOMAIN` (this needs working DNS +
  open ports 80/443).

Watch progress:

```bash
docker compose logs -f app     # app + migration logs
docker compose logs -f caddy   # certificate issuance
```

When the app reports it is ready, open `https://yourdomain.com`.

---

## 5. Create the first admin account

Visit:

```
https://yourdomain.com/admin
```

Payload prompts you to create the first user the first time there are none. Use
a strong, unique password. This account is the Owner/Admin (Pamela).

To add staff later: **Admin → Users → Create**, and choose a role
(Editor = manage content; Viewer = read-only).

---

## 6. Updating (new version)

```bash
git pull
docker compose up -d --build
```

Any new migrations run automatically on boot. Zero-downtime is not guaranteed on
a single host; expect a brief restart.

If you add or change collections/fields during development, create a migration
before deploying:

```bash
npm run payload -- migrate:create describe_your_change
git add src/migrations && git commit -m "db: <change>"
```

---

## 7. Common operations

```bash
# Logs
docker compose logs -f app
docker compose logs -f caddy

# Restart just the app
docker compose restart app

# Stop everything (keeps data volumes)
docker compose down

# Stop and REMOVE data volumes (DESTRUCTIVE — deletes the database & uploads)
docker compose down -v

# Run a one-off migration manually (rarely needed)
docker compose run --rm app node -e "require('child_process')"  # see note below
```

> Migrations normally run automatically on boot. The image is a slim standalone
> build and does not include the Payload CLI, so manage schema changes by
> committing migration files during development (step 6).

---

## 8. Rollback

Because data lives in named volumes, rolling back the **app** is just deploying a
previous image/commit:

```bash
git checkout <previous-good-commit>
docker compose up -d --build
```

> ⚠️ A rollback does **not** undo a database migration. If a release included a
> destructive migration, restore the database from a backup (see
> `BACKUP_RESTORE.md`) instead of only reverting code. Always back up before
> deploying a release that changes the schema.

---

## 9. Health checks & troubleshooting

- **App won't start / DB errors**: `docker compose logs app`. Confirm
  `DATABASE_URI`, `POSTGRES_PASSWORD`, and that the `db` service is healthy
  (`docker compose ps`).
- **No HTTPS / cert errors**: `docker compose logs caddy`. Verify DNS points to
  the server and ports 80/443 are open. Caddy needs both.
- **Emails not sending**: check `SMTP_*`. When unset, the app logs emails to the
  console instead of failing.
- **Uploads disappear after redeploy**: ensure the `uploads` volume is intact
  (`docker volume ls`). Do not run `docker compose down -v` unless you intend to
  wipe data.
