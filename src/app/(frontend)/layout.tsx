import type { Metadata } from 'next'
import { Fraunces, Mulish } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { getSiteSettings } from '@/lib/data'
import { localBusinessJsonLd } from '@/lib/seo'
import { serverUrl } from '@/lib/env'

const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const body = Mulish({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

// Content is CMS-driven and edited live in the admin dashboard, so the public
// site renders at request time rather than being baked in at build time.
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
    icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.jpg' },
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
