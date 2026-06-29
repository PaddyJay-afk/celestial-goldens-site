# Cirilli English Goldens — website & CMS

A production website and content-management system for **Pamela Cirilli**, a
responsible private English Golden Retriever breeder in **Suffolk, Virginia**.

This is **not** a puppy marketplace. It emphasizes responsible breeding, health
testing, application review, education, and matching puppies to suitable
families. **Deposits are gated behind breeder approval — there is no public
instant-purchase checkout.**

Built with **Next.js 15 (App Router)** + **Payload CMS 3** + **PostgreSQL**, and
deployed with **Docker Compose** behind **Caddy** (automatic HTTPS) on an Ubuntu
VPS (e.g. Contabo).

---

## What's included

- **Public website**: Home, Available Puppies, Upcoming Litters, Our Dogs,
  Responsible Breeding, Puppy Application, How It Works, Health Guarantee, FAQ,
  Gallery, Testimonials, Contact.
- **Admin dashboard** (`/admin`): manage puppies, litters, dogs, applications,
  testimonials, FAQs, pages, photos, documents, deposits, and site settings —
  no code required.
- **Validated forms**: application + contact, with Zod server validation,
  honeypot, and rate limiting; submissions are stored and emailed.
- **SEO**: per-page metadata, Open Graph, `sitemap.xml`, `robots.txt`, and
  LocalBusiness/FAQ JSON-LD.
- **Deployment**: `Dockerfile`, `docker-compose.yml`, `Caddyfile`, and docs.

See `CLAUDE.md` for the full architecture, data model, and conventions.

---

## Quick start (local development)

Requirements: Node.js 20.9+ and a PostgreSQL database.

```bash
cp .env.example .env          # then edit values (see below)
npm install
npm run dev                   # http://localhost:3000  (admin at /admin)
```

Minimum `.env` for local dev:

```env
PAYLOAD_SECRET=<run: openssl rand -base64 48>
DATABASE_URI=postgres://USER:PASSWORD@localhost:5432/breeder
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

In development the database schema is created automatically. To load safe
placeholder content and a first admin user:

```bash
npm run seed
```

The seed reads `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env`. **Change
these before using in any shared environment.**

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build (must pass) |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Vitest unit/validation tests |
| `npm run generate:types` | Regenerate `src/payload-types.ts` |
| `npm run seed` | Seed placeholder content + first admin |
| `npm run payload -- migrate:create <name>` | Create a DB migration |

---

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for a complete, step-by-step Contabo VPS
deployment, plus update, logs, and rollback commands. In short:

```bash
cp .env.example .env          # fill in real production values
docker compose up -d --build  # builds app, starts Postgres + app + Caddy
```

On first boot the app runs its database migrations automatically. Then visit
`https://YOUR_DOMAIN/admin` to create the first admin account.

Other docs:

- **[SECURITY.md](./SECURITY.md)** — security model, maintenance, updates,
  passwords, HTTPS, dependency audits.
- **[BACKUP_RESTORE.md](./BACKUP_RESTORE.md)** — backing up and restoring
  Postgres and uploads.

---

## Optional integrations (all env-driven)

- **Email** — set `SMTP_*` to enable application/contact notifications. Works
  with any SMTP provider (Resend via `smtp.resend.com`). Unconfigured = messages
  are logged, forms still work.
- **Stripe** — set `STRIPE_SECRET_KEY` to let the admin generate deposit links
  for **approved** applicants. Unconfigured = deposits are recorded without a
  link. There is never a public checkout.
- **S3 storage** — set `S3_ENABLED=true` and `S3_*` to store uploads in an
  S3-compatible bucket instead of the local volume.

---

## License

Private/UNLICENSED. © Cirilli English Goldens.
