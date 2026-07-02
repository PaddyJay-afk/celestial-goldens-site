# Handoff — Cirilli English Goldens

A quick orientation for Pam (and whoever deploys the site).

## What you're looking at

The site ships fully dressed with **sample content** so it demos and deploys
looking finished: four sample dogs (Daisy, Sadie, Cooper, Juniper), two sample
litters, four sample puppies, sample testimonials, and original placeholder
artwork in a matching engraved-plate style. **All of it is fictional** and
designed to be replaced from the admin dashboard — no code needed.

## Replace-before-launch checklist

Log in at `https://yourdomain.com/admin` and work through this list:

1. **Media** — upload real photos of your dogs (the placeholder art stays
   usable as brand graphics if you like it).
2. **Dogs** — replace the four sample dogs with your real dogs: names,
   registered names, dates of birth, weights, temperaments, and — importantly —
   their **actual** health-testing results and certificate links. The seeded
   health entries are examples of the format, not real results.
3. **Litters & Puppies** — replace the sample litters/puppies or unpublish
   them until your next litter.
4. **Testimonials** — the three seeded testimonials are **fictional samples**.
   Replace them with real quotes from your families (with their permission).
5. **FAQs** — the answers are written generically so most survive as-is, but
   review each one and adjust to your actual policies (deposits, visits,
   delivery, registration).
6. **Site Settings** — confirm your public email/phone, whether your name
   shows, address visibility (default: generalized to "Suffolk, VA"), social
   links, and the trust badges. **Only switch on AKC/OFA/Embark badges if they
   are true for your program.**
7. **Documents** — upload your real contract and health-guarantee PDFs.
8. **Users** — change the generated admin password (Admin → Users → your
   account).

## One-command install (Contabo VPS)

On a fresh Ubuntu VPS, point your domain's DNS A-record at the server IP, then:

```bash
curl -fsSL https://raw.githubusercontent.com/PaddyJay-afk/dog-breeding-site-/main/install.sh | sudo SITE_DOMAIN=yourdomain.com ADMIN_EMAIL=pam@yourdomain.com bash
```

That's the whole install. It sets up Docker, HTTPS, the database, the site,
and prints Pam's admin login when it finishes. Run it again any time to
update. No domain yet? Omit `SITE_DOMAIN=` and it runs in HTTP test mode on
the server's IP.

> Until this branch is merged to `main`, add
> `BRANCH=claude/golden-retriever-breeder-site-05257a` before `bash`.

## About Wix

Wix cannot host this site: Wix only runs sites built in Wix's own editor —
it does not host custom full-stack applications (Next.js + PostgreSQL + a
self-hosted CMS). Moving to Wix would mean rebuilding the site from scratch
inside Wix's tools and paying their subscription, and you would lose the
custom application system, the breeder-approval deposit gating, and ownership
of the stack.

If a managed (non-VPS) host is ever wanted, the right path for **this**
codebase is Vercel (free tier) + Neon Postgres (free tier) — it deploys there
without code changes. But the Contabo VPS with the installer above is the
recommended, fully-owned setup.

## Everything is free & freely licensed

- **Code**: Next.js, Payload CMS, PostgreSQL, Tailwind, Caddy — all free,
  open-source licenses (MIT/BSD/Apache-2.0), free for commercial use.
- **Fonts**: Fraunces & Mulish — SIL Open Font License (free, commercial OK).
- **Artwork**: original, generated for this project, dedicated CC0 (public
  domain) — see `art/LICENSE`. Use it anywhere, no attribution needed.
- **Hosting cost**: only the VPS itself and the domain name.
