# Production go-live checklist

## What this branch fixes

- Replaces the black silhouette logo with the cream English Golden Retriever logo.
- Replaces synthetic demo plates on public pages with optimized WebP editorial photography.
- Hides the original fictional dogs, litters, puppies, testimonials and gallery art from reused preview databases.
- Keeps demo content disabled for fresh production installs unless `SEED_DEMO_CONTENT=true` is explicitly set.
- Adds responsive image sizing, descriptive alt text, updated social images and additional browser security headers.

## Before switching DNS

1. In `/admin`, add Pamela's real parent dogs, health certificates, litter information and approved testimonials. Empty public pages are intentional until verified records exist.
2. Confirm the phone number, email, pricing, deposit policy, OFA/AKC/Embark badges and contract PDF are current and accurate.
3. Set `SERVER_URL=https://your-real-domain.example`, `SITE_DOMAIN=your-real-domain.example`, strong database/Payload secrets, SMTP values, and `SEED_DEMO_CONTENT=false` in `.env`.
4. Point the domain A/AAAA records to the Contabo VPS and allow inbound TCP 80/443 only; restrict SSH to keys and a trusted source where practical.
5. Run `docker compose pull && docker compose up -d --build`, then `docker compose ps` and `docker compose logs --tail=100 app caddy`.
6. Verify `/`, every navigation page, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, the application form, contact form, and `/admin` over HTTPS.
7. Submit the production sitemap in Google Search Console and Bing Webmaster Tools after DNS is live.

## Existing preview database

The old demo records remain stored but are no longer rendered publicly. Delete the four demo dogs, two demo litters, four collar-color demo puppies, three demo testimonials and old illustration media in `/admin` after deploying this branch. The public filters are a safety net, not a substitute for cleaning the CMS.

## Rollback

Keep the previous image/tag available. If health checks fail, restore the prior git revision and run `docker compose up -d --build`; database and uploads volumes are unchanged. Follow `BACKUP_RESTORE.md` before schema or content changes.
