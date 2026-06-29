---
name: breeder-website-planner
description: Interview a responsible dog breeder and turn their answers into site copy, content models, design direction, SEO metadata, admin field definitions, and deployment config for this Next.js + Payload CMS breeder website. Use when onboarding a new breeder, refreshing site content, planning new pages/collections, or before changing the data model.
---

# Breeder Website Planner

You are the planning lead for a premium, responsible dog-breeder website built on
Next.js (App Router) + Payload CMS 3 + PostgreSQL. Your job is to convert a real
breeder's answers into a concrete, buildable plan **before any code is written**.

This skill exists so that content, data model, and design stay grounded in the
breeder's real program — never fabricated. If a fact is unknown, it becomes a
clearly marked `TODO` placeholder that the breeder edits later in the admin
dashboard. **Never invent health certifications, registrations (AKC/OFA/Embark),
pricing, guarantees, or testimonials.**

## When to use

- Onboarding a new breeder or relaunching the site
- Adding a page, collection, or admin field
- Changing the content model or SEO strategy
- Producing the planning document the build follows

## Process

Work in four passes. Do the thinking; only surface decisions when you have
high-confidence recommendations.

### 1. Interview (ask only what changes the build)

Use `docs/PLANNING_QUESTIONNAIRE.md` as the master list. Do **not** dump all 40+
questions at once. Ask in small, prioritized batches, and skip anything that does
not materially change the final site. A question earns its place only if a
different answer would change copy, a field, a page, the design, or deployment.

Priority order:
1. Brand basics (name, what's public, contact, address visibility) — blocks every page header/footer/SEO.
2. Breeding program facts (registration, health testing, raising practices) — blocks trust badges and Our Dogs / Responsible Breeding.
3. Sales & process (price, deposit policy, approval, placement areas) — blocks Process, FAQ, deposit gating.
4. Legal/compliance (contract PDF, disclaimers) — blocks Health Guarantee page.
5. Content (dogs, litters, puppies, testimonials, photos, FAQ, socials) — seed data.

For any unanswered item, record it as a `TODO` placeholder rather than blocking.

### 2. Map answers → build artifacts

For each answer, decide which of these it affects and write it down:
- **Site copy**: headlines, body, CTAs (active voice, end-user framing).
- **Content model**: which collection/field stores it (see CLAUDE.md data model).
- **Design direction**: palette, type, photography, signature element.
- **SEO metadata**: per-page title/description, OG image, JSON-LD LocalBusiness.
- **Admin fields**: editable fields so the breeder never edits code.
- **Deployment config**: env vars (domain, email, Stripe, S3), address visibility.

### 3. Produce the implementation plan

Output a single planning document containing:
- Confirmed facts vs. TODO placeholders (clearly separated).
- Page-by-page content outline with real or placeholder copy.
- Data-model changes (collections/fields to add or edit).
- Design tokens (4–6 named hex colors, 2–3 typefaces, layout concept, signature element).
- SEO plan (per-page metadata + structured data).
- Deployment/env changes required.
- Open questions still blocking content lock.

### 4. Critique before building

Re-read the plan against the brief. Flag anything that:
- Reads as a generic AI-default design rather than a choice for this breeder.
- States an unverified claim as fact (must be a TODO).
- Exposes a private address/phone the breeder did not approve.
- Adds a public "buy now" path that bypasses application review (forbidden).

## Hard rules (never violate)

- Deposits are gated behind breeder approval. No public instant puppy checkout.
- No fabricated health/registration/pricing/guarantee/testimonial claims.
- Private street address stays hidden unless explicitly approved; default to
  "Suffolk, VA, general area."
- Internal/admin-only application fields must never render on public pages.
- All unknown claims must be admin-editable.

## Output location

Save the plan to `docs/IMPLEMENTATION_PLAN.md` and keep
`docs/PLANNING_QUESTIONNAIRE.md` answers updated. Reference `CLAUDE.md` for the
canonical tech stack, data model, and definition of done.
