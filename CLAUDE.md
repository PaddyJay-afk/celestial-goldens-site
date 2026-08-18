# CLAUDE.md — English Golden Retriever Breeder Website

Production website + CMS for **Pamela**, a responsible private English
Golden Retriever breeder in Suffolk, VA. This is **not** a puppy marketplace:
emphasize responsible breeding, health testing, application review, education, and
matching puppies to suitable families. **Deposits are gated behind breeder
approval — never expose a public instant-purchase checkout.**

## Tech stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **CMS / backend:** Payload CMS 3 (runs inside the Next.js app)
- **Database:** PostgreSQL (`@payloadcms/db-postgres`)
- **Styling:** Tailwind CSS 3 + hand-built accessible UI components (`src/components/ui`)
- **Rich text:** Lexical (`@payloadcms/richtext-lexical`)
- **Validation:** Zod (server-side, all public forms)
- **Email:** Nodemailer SMTP adapter via env (Resend works via SMTP creds); no-op + console log when unconfigured
- **Payments:** Stripe deposit links, admin-generated, approved applicants only
- **Storage:** local persistent uploads volume by default; optional S3 via env
- **Deploy:** Docker Compose on Ubuntu VPS (Contabo), Caddy reverse proxy w/ automatic HTTPS

## Project structure

```
src/
  payload.config.ts        # Payload config: db, collections, globals, plugins
  payload-types.ts         # generated types (npm run generate:types)
  collections/             # Users, Media, Dogs, Litters, Puppies, Applications,
                           # Testimonials, FAQs, Pages, ContactMessages, Deposits, Documents
  globals/SiteSettings.ts  # global site config (brand, contact, badges, SEO)
  access/                  # role-based access helpers
  fields/                  # reusable field groups (seo, slug)
  lib/                     # email, rate-limit, stripe, validation (zod), utils
  app/(frontend)/          # public website (App Router)
  app/(payload)/           # Payload admin + REST/GraphQL routes
  seed/                    # safe placeholder seed data
tests/                     # vitest unit + validation + smoke tests
docs/                      # questionnaire + implementation plan
```

## Roles & access

- **admin** (Owner/Pamela): full access, manages users & settings.
- **editor**: manage content collections; cannot manage Users or Site security.
- **viewer**: read-only helper.
Public read is limited to published, non-internal content. Applications and
ContactMessages are never publicly readable; internal/admin-only fields never
render publicly.

## Data model (collections)

- **Users** — auth, `role` field.
- **Media** — uploads with required `alt`, image sizes, type/size restrictions.
- **Dogs** — parent dogs (sire/dam/retired), pedigree, health testing, gallery.
- **Litters** — pairing (sire/dam), dates, status, waitlist, expectations.
- **Puppies** — belong to a litter; status (Available/Reserved/Under Evaluation/Waitlist Only/Placed); `allowDeposit` gate.
- **Applications** — puppy applications; status pipeline; internal notes.
- **ContactMessages** — contact form submissions.
- **Testimonials** — admin-managed, published flag.
- **FAQs** — question/answer, category, order.
- **Pages** — editable long-form content (Responsible Breeding, Process, Health Guarantee, etc.).
- **Deposits** — Stripe deposit link records tied to an approved application.
- **Documents** — uploadable PDFs (contract, health guarantee).
- **SiteSettings** (global) — brand, contact, address visibility, badges, socials, SEO defaults.

## Commands

```bash
npm install              # install deps
npm run dev              # local dev (needs DATABASE_URI + PAYLOAD_SECRET)
npm run build            # production build (must pass)
npm run start            # run production build
npm run lint             # eslint (must pass)
npm run typecheck        # tsc --noEmit
npm run test             # vitest unit/validation/smoke tests
npm run generate:types   # regenerate src/payload-types.ts
npm run seed             # seed safe placeholder data
```

Deployment (see DEPLOYMENT.md):
```bash
docker compose up -d --build      # first deploy / update
docker compose logs -f app        # logs
docker compose exec db pg_dump    # backup (see BACKUP_RESTORE.md)
```

## Security rules

- No secrets in git. Use `.env` (gitignored); ship `.env.example` only.
- All public forms: Zod server validation + honeypot + rate limiting.
- Sanitize rich text; restrict uploads by MIME type and size.
- Secure HTTP headers (set in `next.config.mjs` + Caddy).
- Strong auth defaults (Payload bcrypt, lockout). Admin protected by role access.
- Run app as non-root in Docker; least-privilege DB user.
- `npm audit` in CI / before releases.
- Never expose Pamela's private street address unless `SiteSettings` enables it.

## Coding style

- TypeScript strict. Server-side validation is the source of truth.
- Accessible components: semantic HTML, labeled inputs, visible focus, reduced-motion respected.
- Active-voice, end-user copy. Sentence case. No filler.
- Derive design colors/type from the planned token system (see `docs/IMPLEMENTATION_PLAN.md`).
- Do not fabricate breeding facts; unknowns are admin-editable placeholders marked TODO.

## Definition of done

`npm install`, `npm run dev`, `npm run build`, `npm run lint`, `npm run test` all
pass; Docker Compose starts the full stack; admin login works; Pamela can manage
all content; application + contact forms submit and appear in admin; public pages
responsive; no secrets committed; README explains Contabo deploy; SECURITY.md
covers maintenance/updates/backups/passwords/HTTPS/audits.
