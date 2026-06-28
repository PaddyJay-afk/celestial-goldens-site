import type { MetadataRoute } from 'next'
import { serverUrl } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep the admin and API out of search results.
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${serverUrl}/sitemap.xml`,
    host: serverUrl,
  }
}
