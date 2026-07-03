import type { MetadataRoute } from 'next'
import { serverUrl } from '@/lib/env'

/**
 * Explicitly welcome both search-engine and AI-assistant crawlers; the site
 * is designed to be discovered and cited by LLMs (see /llms.txt). Admin and
 * API routes stay out of every index.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/admin', '/api/']
  const aiCrawlers = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-Web',
    'anthropic-ai',
    'PerplexityBot',
    'Google-Extended',
    'Applebot-Extended',
    'cohere-ai',
    'CCBot',
    'meta-externalagent',
  ]
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: '/', disallow })),
    ],
    sitemap: `${serverUrl}/sitemap.xml`,
    host: serverUrl,
  }
}
