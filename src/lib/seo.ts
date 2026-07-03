import type { Metadata } from 'next'
import type { Media, SiteSetting } from '@/payload-types'
import { serverUrl } from './env'
import { asMedia } from './data'

type SeoGroup = {
  title?: string | null
  description?: string | null
  image?: unknown
} | null | undefined

export const buildMetadata = ({
  title,
  description,
  path = '/',
  seo,
  settings,
  ogFallback,
}: {
  title: string
  description?: string
  path?: string
  seo?: SeoGroup
  settings?: SiteSetting | null
  ogFallback?: unknown
}): Metadata => {
  const business = settings?.businessName ?? 'Celestial English Golden Retrievers'
  const metaTitle = seo?.title || title
  const fullTitle = metaTitle.includes(business) ? metaTitle : `${metaTitle} — ${business}`
  const metaDescription =
    seo?.description ||
    description ||
    settings?.defaultMetaDescription ||
    'Thoughtfully raised English Golden Retrievers in Suffolk, Virginia.'

  const ogImage =
    (asMedia(seo?.image) as Media | null)?.sizes?.og?.url ||
    (asMedia(seo?.image) as Media | null)?.url ||
    (asMedia(ogFallback) as Media | null)?.url ||
    (asMedia(settings?.defaultOgImage) as Media | null)?.url

  const url = `${serverUrl}${path}`

  return {
    title: fullTitle,
    description: metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url,
      siteName: business,
      type: 'website',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: fullTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export const localBusinessJsonLd = (settings: SiteSetting) => {
  const showFull = settings.addressVisibility === 'full'
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.businessName,
    description:
      settings.tagline ?? 'English Golden Retriever breeder in Suffolk, Virginia.',
    url: serverUrl,
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.city ?? 'Suffolk',
      addressRegion: settings.state ?? 'VA',
      addressCountry: 'US',
      ...(showFull && settings.streetAddress
        ? { streetAddress: settings.streetAddress, postalCode: settings.postalCode ?? undefined }
        : {}),
    },
    areaServed: settings.serviceArea ?? 'Suffolk, VA',
    sameAs: [settings.facebook, settings.instagram, settings.youtube, settings.tiktok].filter(
      Boolean,
    ),
  }
}
