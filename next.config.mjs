import { withPayload } from '@payloadcms/next/withPayload'

/**
 * Content Security Policy.
 *
 * `'unsafe-inline'`/`'unsafe-eval'` are required by the Payload admin bundle and
 * Next.js's inline hydration scripts, so this is not an XSS-proof policy — it is
 * a meaningful reduction in blast radius: scripts, frames and form posts are
 * confined to this origin, so injected content cannot exfiltrate to a third
 * party or embed the site in someone else's page.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  // Uploads may be served from S3 when configured; blob: covers admin previews.
  "img-src 'self' data: blob: https:",
  "media-src 'self' data: blob: https:",
  "connect-src 'self' https:",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // Deliberately no `upgrade-insecure-requests`. It would rewrite every asset
  // request to https://, which breaks the IP-only HTTP mode the installer uses
  // before a domain is pointed at the server — the whole site loads unstyled
  // and the admin cannot start. It buys nothing once a domain is live either:
  // all asset URLs are same-origin and relative (next/font self-hosts the
  // fonts at build time), and HSTS plus Caddy's automatic HTTP->HTTPS redirect
  // already keep real traffic on TLS.
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), browsing-topics=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Allow Payload + sharp to work in the standalone Docker output.
  output: 'standalone',
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      // S3 / external storage hosts may be added here via env-driven config.
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
