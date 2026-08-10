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
- **Honeypot** field rejects bots. A filled honeypot gets the same `{ok:true}`
  response as a real submission and is silently discarded, so a bot cannot tell
  the trap from a success. It is checked before validation, so no error response
  ever names the honeypot field.
- **Rate limiting** per IP (`src/lib/rate-limit.ts`). Two tiers: a generous
  ceiling on raw requests, plus a stricter quota charged only when a submission
  is actually stored — so a family who mistypes the form is never locked out of
  contacting the breeder.
- Client IP is read from the right-hand (proxy-written) end of
  `X-Forwarded-For`, never the client-supplied left-hand entry. Caddy is
  configured without `trusted_proxies`, so it replaces a forged header outright.
  If you add a proxy in front (e.g. Cloudflare), set `TRUSTED_PROXY_HOPS` to
  match — see `.env.example`.
- Submissions are written with scoped server-side access, not via public write
  permissions.

**Uploads**
- Images are restricted by MIME type (`jpeg/png/webp/avif`) and size (≤ 8 MB).
- PDF documents are restricted to `application/pdf` and ≤ 15 MB. File contents
  are checked, not just the declared type — a non-PDF renamed `.pdf` is refused.
- A global hard ceiling of 15 MB applies to all uploads.
- Documents are private by default: only those ticked **public** are readable
  anonymously. A document left un-public is hidden from the API *and* its file
  URL returns 403, so contracts shared "on request only" stay private.

**Payments**
- There is **no public checkout**. Stripe deposit links are generated only from
  the admin dashboard, for applicants the breeder has approved.

**HTTP headers**
- Security headers are set in `next.config.mjs` and reinforced by Caddy:
  `Content-Security-Policy`, `Strict-Transport-Security`,
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`. `X-Powered-By` is suppressed.
- The CSP confines scripts, frames and form posts to this origin. It permits
  `'unsafe-inline'`/`'unsafe-eval'` because the Payload admin bundle requires
  them, so it limits the blast radius of an injection rather than preventing one
  outright.

**IP-only HTTP test mode**

The installer can run the site on the server's raw IP over plain HTTP, before a
domain is pointed at the box. This mode is for checking the deployment, not for
real traffic, and it is deliberately looser in two ways:

- No HTTPS, so traffic (including the admin login) is unencrypted.
- Payload's CSRF origin allowlist is off. It has to be: browsers omit the
  `Sec-Fetch-*` headers on non-HTTPS origins, and Payload falls back to those
  headers when a request has no `Origin` — with the allowlist on, every admin
  page bounces back to the login screen. The auth cookie stays `SameSite=Lax`,
  which is what actually stops a cross-site page from carrying it into a
  mutation.

Both tighten automatically the moment `NEXT_PUBLIC_SERVER_URL` is an `https://`
address. Point a domain at the server and re-run the installer with
`SITE_DOMAIN=` as soon as you can, and change the generated admin password.

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
