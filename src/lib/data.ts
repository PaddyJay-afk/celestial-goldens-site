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

let cached: Awaited<ReturnType<typeof getPayload>> | null = null

// These records shipped in the original demo database and were explicitly
// fictional. Keep them out of the public site even when an existing preview
// volume is reused. Pamela can add verified records in the CMS normally.
const demoDogNames = new Set(['Daisy', 'Sadie', 'Cooper', 'Juniper'])
const demoLitterNames = new Set([
  'The Stardust Litter — Daisy × Cooper',
  'The Aurora Litter — Sadie × Cooper',
])
const demoPuppyNames = new Set(['Green Collar', 'Pink Collar', 'Blue Collar', 'Yellow Collar'])
const demoTestimonialOwners = new Set(['Rachel', 'Marcus', 'The Hendersons'])
const demoMediaNames = [
  'dog-daisy', 'dog-sadie', 'dog-cooper', 'dog-juniper',
  'puppy-green', 'puppy-pink', 'puppy-blue', 'puppy-yellow',
  'gallery-oak-hill', 'gallery-dusk', 'gallery-goldenrod',
  'gallery-paw-quilt', 'gallery-crest', 'hero-meadow', 'litter-spring', 'og-banner',
]

export const payloadClient = async () => {
  if (!cached) cached = await getPayload({ config })
  return cached
}

/** Site settings global — always available (returns defaults if unset). */
export const getSiteSettings = async (): Promise<SiteSetting> => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
}

export const getPublishedPuppies = async (): Promise<Puppy[]> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'puppies',
    where: { published: { equals: true } },
    depth: 2,
    limit: 100,
    sort: '-createdAt',
  })
  return res.docs.filter((puppy) => !demoPuppyNames.has(puppy.name))
}

export const getPuppyBySlug = async (slug: string): Promise<Puppy | null> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'puppies',
    where: { slug: { equals: slug }, published: { equals: true } },
    depth: 2,
    limit: 1,
  })
  const puppy = res.docs[0]
  return puppy && !demoPuppyNames.has(puppy.name) ? puppy : null
}

export const getLitters = async (statuses?: string[]): Promise<Litter[]> => {
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
  return res.docs.filter((litter) => !demoLitterNames.has(litter.name))
}

export const getDogs = async (role?: Dog['role']): Promise<Dog[]> => {
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
  return res.docs.filter((dog) => !demoDogNames.has(dog.callName))
}

export const getTestimonials = async (onlyFeatured = false): Promise<Testimonial[]> => {
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
  return res.docs.filter((testimonial) => !demoTestimonialOwners.has(testimonial.ownerName))
}

export const getFaqs = async (): Promise<Faq[]> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'faqs',
    where: { published: { equals: true } },
    depth: 0,
    limit: 200,
    sort: 'order',
  })
  return res.docs
}

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, published: { equals: true } },
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ?? null
}

export const getGalleryImages = async (limit = 60): Promise<Media[]> => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'media',
    depth: 0,
    limit,
    sort: '-createdAt',
  })
  return res.docs.filter((media) =>
    !demoMediaNames.some((name) => media.filename?.includes(name)),
  )
}

export const getPublicDocuments = async () => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'documents',
    where: { public: { equals: true } },
    depth: 0,
    limit: 50,
  })
  return res.docs
}

/** Narrow a possibly-populated relationship/upload to its Media object. */
export const asMedia = (value: unknown): Media | null => {
  if (value && typeof value === 'object' && 'url' in (value as Media)) {
    return value as Media
  }
  return null
}
