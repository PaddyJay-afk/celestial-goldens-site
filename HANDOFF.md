# Handoff — Celestial English Golden Retrievers

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
curl -fsSL https://raw.githubusercontent.com/PaddyJay-afk/dog-breeding-site-/claude/golden-retriever-breeder-site-05257a/install.sh | sudo SITE_DOMAIN=yourdomain.com ADMIN_EMAIL=pam@yourdomain.com bash
```

That's the whole install. It sets up Docker, HTTPS, the database, the site,
and prints Pam's admin login when it finishes. Run it again any time to
update. No domain yet? Omit `SITE_DOMAIN=` and it runs in HTTP test mode on
the server's IP.

> After this branch is merged to `main`, you can switch the URL and add
> `BRANCH=main` — until then the command above works as-is.

**If the GitHub repo is private**, the command above can't download anything
anonymously. Either make the repo public (Settings → General → Danger Zone →
Change visibility — it contains no secrets), or create a fine-grained personal
access token with read access to this repo and run:

```bash
curl -fsSL -H "Authorization: token YOUR_TOKEN" \
  https://raw.githubusercontent.com/PaddyJay-afk/dog-breeding-site-/claude/golden-retriever-breeder-site-05257a/install.sh \
  | sudo GITHUB_TOKEN=YOUR_TOKEN SITE_DOMAIN=yourdomain.com ADMIN_EMAIL=pam@yourdomain.com bash
```

## Getting found — the free SEO playbook

The site ships with the technical SEO done: per-page titles tuned to what
families search, LocalBusiness/FAQ/Article/Breadcrumb structured data,
`sitemap.xml`, `robots.txt` that welcomes Google **and** AI assistants
(ChatGPT, Claude, Perplexity), a live `/llms.txt` feed AI crawlers read, a
long-form breed guide at `/english-golden-retrievers` built to earn search
traffic and AI citations, and fast page loads.

The rest is free but requires Pam's hands (do these once the domain is live):

1. **Google Search Console** (search.google.com/search-console) — verify the
   domain, paste the token into `GOOGLE_SITE_VERIFICATION` in `.env`, redeploy,
   then submit `https://yourdomain.com/sitemap.xml`. This is how Google finds
   every page.
2. **Google Business Profile** (business.google.com) — free listing; category
   "Dog breeder", service area Suffolk/Hampton Roads, phone + website. This is
   what puts you on the map for "golden retriever breeder near me". Collect
   Google reviews from every family — reviews are the single strongest local
   ranking signal.
3. **Bing Webmaster Tools** (free, imports from Search Console in one click) —
   Bing powers ChatGPT search.
4. **Free breeder directories** — AKC Marketplace (you're AKC-registered, use
   it), Good Dog, and the Golden Retriever Club of America breeder referral
   list. Fill each profile completely and link the website; these links also
   feed the AI assistants' knowledge.
5. **Every litter is content** — when a litter is announced or arrives, update
   the Litters page and post the link anywhere you're listed. Fresh pages on a
   site is what keeps Google coming back.
6. **Ask every family for two sentences** — real testimonials with first
   names + towns (replace the samples!) are conversion gold and unique content
   no competitor can copy.

What was deliberately *not* done: no fake reviews, no invented ratings
schema, no keyword stuffing. Google penalizes all three; a small honest site
with real reviews beats them.

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
