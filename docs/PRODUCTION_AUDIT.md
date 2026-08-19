# Production Readiness Audit

**Project:** Celestial English Golden Retrievers  
**Audit status:** Code and configuration audit complete; live-release verification pending GitHub and VPS access.  
**Scope:** Security controls, dependency risk, form abuse resistance, edge cases, release build, reverse-proxy configuration, internal links, and deployment readiness.

## Executive summary

The current local release branch is production-oriented and has passed its automated quality gates. The public preview is **not yet a valid representation of this release**: it still displays old fictional demo records and the prior low-contrast presentation. The current code deliberately filters those records from public rendering, uses improved editorial imagery, and includes responsive layout updates. It must be published to GitHub and deployed to the Contabo VPS before a final live acceptance test can be completed.

| Area | Result | Evidence |
| --- | --- | --- |
| Production build | Pass | `npm run build` completed successfully on Next.js 16.3.0. |
| Type safety | Pass | `npm run typecheck` completed successfully. |
| Linting | Pass | `npm run lint` completed with no warnings or errors. |
| Automated tests | Pass | 22 tests across validation, utilities, rate limiting, and public request parsing. |
| Dependency audit | Pass | `npm audit` reported 0 production and development vulnerabilities. |
| Static security scan | Reviewed | Semgrep reported one low-confidence path-traversal warning in the non-public seeder; input is static asset names rather than user input. |
| Reverse proxy | Pass | Caddy configuration validated with the production environment variables expected by Docker Compose. |
| Internal navigation | Pass | Static audit found no referenced internal route without an implemented page. |

## Findings addressed

| Finding | Risk | Resolution |
| --- | --- | --- |
| Public form endpoints accepted arbitrarily large JSON bodies. | Resource exhaustion and avoidable memory pressure. | Added a 64 KiB content-length and streaming-body limit, JSON-only request enforcement, and explicit `400`, `413`, and `415` responses. |
| Replaceable CMS uploads were cached for one year. | Families could see stale photos, listings, or documents after CMS updates. | Kept immutable caching for fingerprinted Next assets only; set CMS upload/document caching to 24 hours. |
| Deployment instructions referred to an invalid environment variable. | Misconfigured canonical URL, CORS, CSRF, sitemap, and email links at launch. | Updated the runbook to use `NEXT_PUBLIC_SERVER_URL`. |
| Existing preview still exposed fictional seed content. | Reputational and trust risk for a breeder website. | Current release filters legacy demo records from all public data fetches and keeps demo seeding disabled unless explicitly enabled. |
| Public request edge cases lacked automated coverage. | Regression risk for malformed/oversized requests. | Added five request-parser tests covering valid, malformed, unsupported, declared-oversized, and chunked-oversized bodies. |

## Security posture

The application uses private Payload collections for contact messages and puppy applications, role-based access for staff operations, server-side Zod validation, honeypot fields, IP-based rate limiting, upload MIME restrictions, file-size ceilings, production CORS/CSRF allowlists, and Caddy/Next security headers. The release uses strict production headers including HSTS, `nosniff`, frame protection, referrer policy, permissions policy, and cross-origin opener isolation.

> A strict Content Security Policy was not added because the Payload administrative application requires a policy designed and tested against its dynamic admin assets. Applying an untested CSP would create a material admin-outage risk. This should be introduced later in report-only mode after deployment telemetry is available.

## Required live-release steps

1. Restore valid GitHub authentication for the repository so the local release commits can be pushed to `main`.
2. Provide or connect the Contabo VPS SSH access, together with the intended production domain.
3. Run the supplied installer or Docker Compose deployment with secure production environment values.
4. Confirm DNS and inbound ports 80/443, then allow Caddy to issue the TLS certificate.
5. Add verified parent-dog, litter, puppy, health-testing, testimonial, and contract content from `/admin`; generated images are representative only and must not be presented as real animals.
6. Execute a final live acceptance test covering HTTPS, headers, navigation, forms, admin authentication, CMS upload/update propagation, mobile menu, desktop layout, sitemap, robots, and error paths.

## Known verification limitations

No authenticated Contabo host is connected to this session, and the GitHub credential currently available to this session rejected Git operations. Therefore, this audit does **not** claim that the latest commit is live. It verifies the release branch and local production build only. The final live verification remains a required deployment gate.
