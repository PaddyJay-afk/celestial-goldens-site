import { cache } from 'react'
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
 * Every reader below is wrapped in React's `cache()`, which de-duplicates calls
 * within a single request render. The site settings global, for example, is
 * read by the layout's metadata, the page's metadata, the header and the footer
 * — four identical round trips to Postgres per page view without this.
 *
 * The cache lives for one render only, so the admin dashboard's edits still
 * appear on the very next request.
 */

let cached: Awaited<ReturnType<typeof getPayload>> | null = null

export const payloadClient = async () => {
  if (!cached) cached = await getPayload({ config })
  return cached
}

/** Site settings global — always available (returns defaults if unset). */
export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getPublishedPuppies = cache(async (): Promise<Puppy[]> => {
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

export const getPuppyBySlug = cache(async (slug: string): Promise<Puppy | null> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'puppies',
    where: { slug: { equals: slug }, published: { equals: true } },
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ?? null
})

export const getLitters = cache(async (statuses?: string[]): Promise<Litter[]> => {
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

export const getDogs = cache(async (role?: Dog['role']): Promise<Dog[]> => {
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

export const getTestimonials = cache(async (onlyFeatured = false): Promise<Testimonial[]> => {
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

export const getFaqs = cache(async (): Promise<Faq[]> => {
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

export const getPageBySlug = cache(async (slug: string): Promise<Page | null> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, published: { equals: true } },
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ?? null
})

export const getGalleryImages = cache(async (limit = 60): Promise<Media[]> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'media',
    depth: 0,
    limit,
    sort: '-createdAt',
  })
  return res.docs
})

export const getPublicDocuments = cache(async () => {
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
