# Implementation Plan — Celestial English Golden Retrievers

Status: initial build. Facts unknown at build time ship as **TODO placeholders**,
editable in the admin dashboard. No breeding facts are fabricated.

## Confirmed vs. TODO

**Confirmed by brief:** breeder = Pamela; location = Suffolk, VA; breed =
English Golden Retriever; responsible-breeding positioning; deposits gated behind
approval; "not legal/veterinary advice" disclaimer included.

**TODO (placeholders shipped, admin-editable):** business name, public
phone/email, address visibility, logo, AKC/OFA/Embark status, exact health tests,
pricing, deposit policy, payment methods, transport, dog/litter/puppy records,
testimonials, photos, socials, FAQ answers, contract & health-guarantee PDFs.

## Design tokens

Direction: **"Meadow & hearth" — a Virginia golden hour.** Editorial, warm, and
calm; a respected family program, not a classified ad. We deliberately avoid the
generic cream + high-contrast-serif + terracotta AI default by anchoring on a
deep **meadow green** as the primary (not the accent) with **honey gold** used
sparingly, and a soft serif with optical sizing rather than a stark Didone.

- Color (6 named):
  - `cream` `#FBF8F1` — page background (paper)
  - `ivory` `#FEFCF7` — cards / raised surfaces
  - `forest` `#29382E` — primary: headings, footer, nav accents
  - `sage` `#7C8C6F` — secondary green, dividers, quiet fills
  - `gold` `#BD8B3C` — accent: rules, focus, small CTAs (used with restraint)
  - `charcoal` `#2C2A25` — body text (`muted` `#6E6A5F` for secondary text)
- Type:
  - Display: **Fraunces** (soft serif, optical sizing) — headlines, used large and restrained
  - Body: **Mulish** (humanist sans) — body, labels, UI
- Layout: generous whitespace, max-w ~72rem, rounded `--radius` 14px cards, large
  emotional photography with arched-top treatment on hero/feature images.
- Signature element: the **collar-color dot** — puppies in a litter are identified
  by collar color, so a small colored dot is used as a real structural marker on
  puppy cards and litter rows (encodes true content, not decoration). Paired with
  a thin gold eyebrow rule.
- Motion: restraint only — gentle fade/translate on scroll reveal, hover lift on
  cards; respects `prefers-reduced-motion`.

## Pages (App Router, `src/app/(frontend)`)

Home, Available Puppies, Upcoming Litters, Our Dogs, Responsible Breeding, Apply
(application form), Process, Health Guarantee, FAQ, Gallery, Testimonials,
Contact. Plus `sitemap.ts`, `robots.ts`, JSON-LD LocalBusiness.

## Data model

Collections: Users, Media, Dogs, Litters, Puppies, Applications, Testimonials,
FAQs, Pages, ContactMessages, Deposits, Documents. Global: SiteSettings. See
`CLAUDE.md` for fields and access rules.

## Forms & security

Apply + Contact use server-side Zod validation, honeypot, and in-memory rate
limiting; submissions persist to Payload and trigger email (admin notification +
applicant confirmation) when SMTP is configured. Deposits are admin-generated
Stripe links for approved applicants only.

## SEO

Per-page metadata, OG images, sitemap, robots, LocalBusiness JSON-LD, CMS
alt-text, clean URLs.

## Deployment

Dockerfile (multi-stage, non-root), docker-compose (app + postgres + caddy),
Caddyfile (automatic HTTPS), persistent volumes for pgdata + uploads. See
DEPLOYMENT.md / SECURITY.md / BACKUP_RESTORE.md.
