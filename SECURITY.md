# Security

This document describes the security model and the routine maintenance that
keeps the site safe: updates, passwords, HTTPS, backups, and dependency audits.

## Reporting

If you discover a vulnerability, contact the site owner directly. Do not open a
public issue with exploit details.

---

## Security model & built-in protections

**Secrets**
- No secrets in git. All secrets come from environment variables (`.env`), which
  is gitignored. Only `.env.example` (placeholders) is committed.
- `PAYLOAD_SECRET` signs auth tokens — keep it long, random, and private.

**Authentication & roles**
- Admin auth is handled by Payload with bcrypt password hashing.
- Brute-force protection: accounts lock after repeated failed logins
  (`maxLoginAttempts` / `lockTime` in `src/collections/Users.ts`).
- Auth cookies are `SameSite=Lax` and `Secure` in production.
- Three roles: **admin** (full access), **editor** (content only — cannot manage
  users or security), **viewer** (read-only). Role assignment is admin-only.

**Public data exposure**
- Public reads are limited to **published, non-internal** content.
- **Applications** and **Contact messages** are never publicly readable; internal
  fields (status, admin notes) never render on the public site.
- Pamela's street address is hidden by default and only shown if Site Settings is
  explicitly set to "Show full address".

**Forms (application & contact)**
- Server-side **Zod** validation is the source of truth (client validation is
  convenience only).
- **Honeypot** field rejects bots.
- **Rate limiting** per IP (`src/lib/rate-limit.ts`) throttles abuse.
- Submissions are written with scoped server-side access, not via public write
  permissions.

**Uploads**
- Images are restricted by MIME type (`jpeg/png/webp/avif`) and size (≤ 8 MB).
- PDF documents are restricted to `application/pdf` and ≤ 15 MB.
- A global hard ceiling of 15 MB applies to all uploads.

**Payments**
- There is **no public checkout**. Stripe deposit links are generated only from
  the admin dashboard, for applicants the breeder has approved.

**HTTP headers**
- Security headers are set in `next.config.mjs` and reinforced by Caddy:
  `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`.

**Network & process**
- The app runs as a non-root user in Docker.
- PostgreSQL is not exposed to the host/internet — only the app reaches it on the
  internal Docker network.
- Caddy terminates TLS with automatic HTTPS and modern defaults.

---

## Routine maintenance

### Passwords
- Use a unique, strong password (16+ chars) for every admin/editor account.
- Rotate the `PAYLOAD_SECRET` and `POSTGRES_PASSWORD` if you suspect exposure
  (rotating `PAYLOAD_SECRET` logs everyone out).
- Remove staff accounts that are no longer needed.

### HTTPS
- Caddy renews certificates automatically. Verify with
  `docker compose logs caddy`. Keep ports 80 and 443 open so renewals succeed.

### Dependency audits
Run before each release and periodically:

```bash
npm audit                 # review advisories
npm audit fix             # apply safe (non-breaking) fixes
npm outdated              # see available updates
```

Apply security updates promptly. After updating dependencies, re-run:

```bash
npm run lint && npm run typecheck && npm run test && npm run build
```

Keep the base Docker images current too:

```bash
docker compose pull        # refresh postgres/caddy base images
docker compose up -d --build
```

### Backups
Follow `BACKUP_RESTORE.md`. Back up **before** any release that changes the
database schema, and verify a restore periodically.

### Updates
Keep the host OS patched (`sudo apt-get update && sudo apt-get upgrade`) and
reboot when the kernel updates.

---

## Incident checklist

1. Rotate `PAYLOAD_SECRET`, `POSTGRES_PASSWORD`, and any leaked API keys.
2. Force-reset admin/editor passwords.
3. Review recent admin logins and content changes.
4. Restore from a known-good backup if data integrity is in doubt.
5. Run `npm audit` and update vulnerable dependencies.
