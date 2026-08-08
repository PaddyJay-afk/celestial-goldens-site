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

  const configuredOgImage =
    (asMedia(seo?.image) as Media | null)?.sizes?.og?.url ||
    (asMedia(seo?.image) as Media | null)?.url ||
    (asMedia(ogFallback) as Media | null)?.url ||
    (asMedia(settings?.defaultOgImage) as Media | null)?.url
  const ogImage = configuredOgImage?.includes('celestial-logo')
    ? '/brand/celestial-english-golden-retrievers-logo.webp'
    : configuredOgImage || '/brand/celestial-english-golden-retrievers-logo.webp'

  const url = `${serverUrl}${path}`

  return {
    // Prevent the root layout's title template from appending the brand twice.
    title: { absolute: fullTitle },
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
  const configuredOgImage = (asMedia(settings.defaultOgImage) as Media | null)?.url
  const ogImage = configuredOgImage?.includes('celestial-logo')
    ? '/brand/celestial-english-golden-retrievers-logo.webp'
    : configuredOgImage || '/brand/celestial-english-golden-retrievers-logo.webp'
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${serverUrl}/#business`,
    name: settings.businessName,
    description:
      settings.tagline ?? 'English Golden Retriever breeder in Suffolk, Virginia.',
    url: serverUrl,
    ...(ogImage ? { image: ogImage.startsWith('http') ? ogImage : `${serverUrl}${ogImage}` } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.city ?? 'Suffolk',
      addressRegion: settings.state ?? 'VA',
      addressCountry: 'US',
      ...(showFull && settings.streetAddress
        ? { streetAddress: settings.streetAddress, postalCode: settings.postalCode ?? undefined }
        : {}),
    },
    // Suffolk, VA city centroid — intentionally generalized, not the home address.
    geo: { '@type': 'GeoCoordinates', latitude: 36.7282, longitude: -76.5836 },
    areaServed: [
      { '@type': 'City', name: settings.city ?? 'Suffolk' },
      { '@type': 'State', name: 'Virginia' },
      { '@type': 'Country', name: 'United States' },
    ],
    founder: {
      '@type': 'Person',
      name: settings.showBreederName ? (settings.breederName ?? 'Pamela') : 'The breeder',
      jobTitle: 'Breeder',
    },
    knowsAbout: [
      'English Golden Retriever',
      'English Cream Golden Retriever',
      'Golden Retriever puppies',
      'responsible dog breeding',
      'OFA health testing',
      'AKC limited registration',
    ],
    slogan: 'One litter a year, raised in my living room.',
    sameAs: [settings.facebook, settings.instagram, settings.youtube, settings.tiktok].filter(
      Boolean,
    ),
  }
}

/** BreadcrumbList JSON-LD for subpages. */
export const breadcrumbJsonLd = (items: Array<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${serverUrl}${item.path}`,
  })),
})
