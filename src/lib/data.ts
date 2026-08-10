import { cache as perRequest } from 'react'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type {
  Dog,
  Faq,
  Litter,
  Media,
  Page,
  Puppy,
  SiteSetting,
  Testimonial,
} from '@/payload-types'

/**
 * Two layers of caching sit under every reader below.
 *
 * `perRequest` (React's cache) de-duplicates identical calls inside a single
 * render. The site settings global, for example, is read by the layout's
 * metadata, the page's metadata, the header and the footer — four identical
 * round trips to Postgres per page view without it.
 *
 * `unstable_cache` then keeps the result across requests, so repeat visitors do
 * not re-run the query at all. That cache is keyed by CONTENT_TAG and purged
 * the instant anything is saved in the dashboard (see `src/hooks/revalidate.ts`),
 * so there is no staleness window to wait out — Pamela saves, the next request
 * is fresh.
 */
export const CONTENT_TAG = 'celestial:content'

const reader = <A extends unknown[], R>(key: string, fn: (...args: A) => Promise<R>) =>
  perRequest(unstable_cache(fn, [key], { tags: [CONTENT_TAG] }))

let cached: Awaited<ReturnType<typeof getPayload>> | null = null

export const payloadClient = async () => {
  if (!cached) cached = await getPayload({ config })
  return cached
}

/** Site settings global — always available (returns defaults if unset). */
export const getSiteSettings = reader('getSiteSettings', async (): Promise<SiteSetting> => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getPublishedPuppies = reader('getPublishedPuppies', async (): Promise<Puppy[]> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'puppies',
    where: { published: { equals: true } },
    depth: 2,
    limit: 100,
    sort: '-createdAt',
  })
  return res.docs
})

export const getPuppyBySlug = reader('getPuppyBySlug', async (slug: string): Promise<Puppy | null> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'puppies',
    where: { slug: { equals: slug }, published: { equals: true } },
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ?? null
})

export const getLitters = reader('getLitters', async (statuses?: string[]): Promise<Litter[]> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'litters',
    where: {
      published: { equals: true },
      ...(statuses ? { status: { in: statuses } } : {}),
    },
    depth: 2,
    limit: 100,
    sort: '-expectedDate',
  })
  return res.docs
})

export const getDogs = reader('getDogs', async (role?: Dog['role']): Promise<Dog[]> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'dogs',
    where: {
      published: { equals: true },
      ...(role ? { role: { equals: role } } : {}),
    },
    depth: 2,
    limit: 100,
    sort: 'callName',
  })
  return res.docs
})

export const getTestimonials = reader('getTestimonials', async (onlyFeatured = false): Promise<Testimonial[]> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'testimonials',
    where: {
      published: { equals: true },
      ...(onlyFeatured ? { featured: { equals: true } } : {}),
    },
    depth: 1,
    limit: 50,
    sort: '-date',
  })
  return res.docs
})

export const getFaqs = reader('getFaqs', async (): Promise<Faq[]> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'faqs',
    where: { published: { equals: true } },
    depth: 0,
    limit: 200,
    sort: 'order',
  })
  return res.docs
})

export const getPageBySlug = reader('getPageBySlug', async (slug: string): Promise<Page | null> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, published: { equals: true } },
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ?? null
})

export const getGalleryImages = reader('getGalleryImages', async (limit: number = 60): Promise<Media[]> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'media',
    depth: 0,
    limit,
    sort: '-createdAt',
  })
  return res.docs
})

export const getPublicDocuments = reader('getPublicDocuments', async () => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'documents',
    where: { public: { equals: true } },
    depth: 0,
    limit: 50,
  })
  return res.docs
})

/** Narrow a possibly-populated relationship/upload to its Media object. */
export const asMedia = (value: unknown): Media | null => {
  if (value && typeof value === 'object' && 'url' in (value as Media)) {
    return value as Media
  }
  return null
}
