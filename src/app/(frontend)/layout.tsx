import type { Metadata } from 'next'
import { Fraunces, Mulish } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { getSiteSettings } from '@/lib/data'
import { localBusinessJsonLd } from '@/lib/seo'
import { serverUrl } from '@/lib/env'

/**
 * Both families are variable fonts, so no `weight` is listed on purpose:
 * next/font then ships one file per style covering the whole weight range,
 * instead of a separate file per weight. That took the webfont payload from ten
 * files to three, which is the bulk of what the browser waits on before it can
 * paint the final text — the largest-contentful-paint element on most pages.
 */
const display = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const body = Mulish({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

/**
 * Pages render at request time; the *data* behind them is cached instead (see
 * `src/lib/data.ts`), and purged the moment anything is saved in the dashboard
 * (`src/hooks/revalidate.ts`).
 *
 * Full static rendering is deliberately not used: it makes Next prerender every
 * page during `next build`, which would require a live database inside the
 * Docker build step. The image builds with no database reachable, so that
 * combination fails the deploy outright.
 */
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    metadataBase: new URL(serverUrl),
    title: {
      default: `${settings.businessName} — English Golden Retrievers in Suffolk, VA`,
      template: `%s — ${settings.businessName}`,
    },
    description:
      settings.defaultMetaDescription ??
      'A responsible English Golden Retriever breeding program in Suffolk, Virginia. Health-tested parents, family-raised puppies, and lifelong support.',
    icons: { icon: '/favicon.svg' },
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const jsonLd = localBusinessJsonLd(settings)

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header businessName={settings.businessName} />
        <main id="main">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
