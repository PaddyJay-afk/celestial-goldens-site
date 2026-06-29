# Backup & Restore

Two things must be backed up:

1. **PostgreSQL database** — all content, applications, users (the `pgdata`
   volume).
2. **Uploads** — images and PDFs stored on disk (the `uploads` volume), unless
   you use S3, in which case rely on your bucket's versioning/backups.

Commands assume you run them from the project directory on the server, where
`docker compose` and `.env` live.

---

## Back up the database

```bash
# Timestamped SQL dump on the host
docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" \
  > backup-db-$(date +%F-%H%M).sql
```

If `$POSTGRES_USER` / `$POSTGRES_DB` aren't in your shell, use the values from
`.env` (defaults: `breeder` / `breeder`).

Compress for storage:

```bash
gzip backup-db-*.sql
```

## Back up uploads

```bash
# Archive the uploads volume via a throwaway container
docker run --rm \
  -v cirilli-goldens_uploads:/data \
  -v "$PWD":/backup \
  alpine tar czf /backup/backup-uploads-$(date +%F-%H%M).tar.gz -C /data .
```

> The volume name is `<project>_uploads`. Find the exact name with
> `docker volume ls`. The project prefix comes from the directory name.

## Store backups off the server

Copy backups somewhere off-box (another host, S3, etc.):

```bash
# Example: pull to your laptop
scp user@server:/path/cirilli-goldens/backup-db-*.sql.gz .
scp user@server:/path/cirilli-goldens/backup-uploads-*.tar.gz .
```

## Automate (daily cron)

```bash
crontab -e
# Run daily at 02:30, keep 14 days of DB dumps
30 2 * * * cd /path/cirilli-goldens && docker compose exec -T db pg_dump -U breeder breeder | gzip > backups/db-$(date +\%F).sql.gz && find backups -name 'db-*.sql.gz' -mtime +14 -delete
```

Create the `backups/` directory first and ensure it is off your web root.

---

## Restore the database

⚠️ Restoring overwrites current data. Take a fresh backup first if possible.

```bash
# 1. (Optional) stop the app so nothing writes during restore
docker compose stop app

# 2. Drop & recreate the database, then load the dump
gunzip -c backup-db-YYYY-MM-DD-HHMM.sql.gz | \
  docker compose exec -T db psql -U breeder -d breeder

# 3. Start the app again
docker compose start app
```

For a completely clean restore (recreate the schema from scratch):

```bash
docker compose exec -T db psql -U breeder -d postgres -c "DROP DATABASE breeder;"
docker compose exec -T db psql -U breeder -d postgres -c "CREATE DATABASE breeder OWNER breeder;"
gunzip -c backup-db-YYYY-MM-DD-HHMM.sql.gz | docker compose exec -T db psql -U breeder -d breeder
```

## Restore uploads

```bash
docker run --rm \
  -v cirilli-goldens_uploads:/data \
  -v "$PWD":/backup \
  alpine sh -c "rm -rf /data/* && tar xzf /backup/backup-uploads-YYYY-MM-DD-HHMM.tar.gz -C /data"
docker compose restart app
```

---

## Verify your backups

A backup you have never restored is a guess. Periodically:

1. Spin up a throwaway copy (or a staging server).
2. Restore the latest DB dump and uploads.
3. Confirm the admin loads and content/images appear.

## Disaster recovery (new server)

1. Provision a new VPS and install Docker (see `DEPLOYMENT.md`).
2. Clone the repo and recreate `.env` with the **same** `PAYLOAD_SECRET`.
3. `docker compose up -d --build`.
4. Restore the database and uploads as above.
5. Point DNS at the new server; Caddy will issue a fresh certificate.
