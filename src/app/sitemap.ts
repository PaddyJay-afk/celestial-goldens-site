import type { MetadataRoute } from 'next'
import { serverUrl } from '@/lib/env'
import { getDogs, getPageBySlug } from '@/lib/data'

export const dynamic = 'force-dynamic'

const STATIC_PATHS = [
  '',
  '/available-puppies',
  '/upcoming-litters',
  '/our-dogs',
  '/responsible-breeding',
  '/process',
  '/health-guarantee',
  '/faq',
  '/gallery',
  '/testimonials',
  '/contact',
  '/apply',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${serverUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '/available-puppies' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))

  // Confirm dynamic content exists without failing the build if the DB is down.
  try {
    await getDogs()
    await getPageBySlug('responsible-breeding')
  } catch {
    // ignore — return static entries only
  }

  return entries
}
