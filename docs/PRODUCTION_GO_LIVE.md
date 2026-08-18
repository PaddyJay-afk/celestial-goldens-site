# Production go-live checklist

## What this covers

Launch-safe defaults on `main`: polished editorial imagery and verified program
copy, without publishing fictional dogs, litters, puppies, or testimonials.

## Before switching DNS

1. In `/admin`, add Pamela's real parent dogs, health certificates, litter information and approved testimonials. Empty public pages are intentional until verified records exist.
2. Confirm the phone number, email, pricing, deposit policy, OFA/AKC/Embark badges and contract PDF are current and accurate.
3. Set `NEXT_PUBLIC_SERVER_URL=https://your-real-domain.example`, `SITE_DOMAIN=your-real-domain.example`, strong database/Payload secrets, SMTP values, and `SEED_DEMO_CONTENT=false` in `.env`.
4. Point the domain A/AAAA records to the Contabo VPS and allow inbound TCP 80/443 only; restrict SSH to keys and a trusted source where practical.
5. Run `docker compose pull && docker compose up -d --build`, then `docker compose ps` and `docker compose logs --tail=100 app caddy`.
6. Verify `/`, every navigation page, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, the application form, contact form, and `/admin` over HTTPS.
7. Submit the production sitemap in Google Search Console and Bing Webmaster Tools after DNS is live.

## Existing preview database

If a reused preview database still contains fictional demo records, delete them
in `/admin` before go-live. Public pages only show published CMS records — there
is no name denylist.

## Rollback

Keep the previous image/tag available. If health checks fail, restore the prior git revision and run `docker compose up -d --build`; database and uploads volumes are unchanged. Follow `BACKUP_RESTORE.md` before schema or content changes.
