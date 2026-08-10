import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { CONTENT_TAG } from '@/lib/data'

/**
 * Purges the cached content queries whenever anything changes in the dashboard.
 *
 * The public site caches its database reads across requests rather than
 * re-querying Postgres on every page view. Caching on a timer would mean
 * Pamela edits a puppy and waits before the change appears — exactly the "is it
 * broken?" confusion to avoid on a phone. So the cache never expires on its own
 * and is purged here instead: she saves, the next page load is fresh.
 *
 * One tag covers every reader. That is deliberately blunt — this site
 * cross-links content between pages (a dog appears on the home page, its own
 * page, and any litter it belongs to), so purging selectively would risk
 * leaving a stale copy somewhere.
 */
const purgePublicPages = (label: string) => {
  try {
    // `expire: 0` drops the entry immediately rather than letting it linger on
    // a lifetime profile — an edit must be visible on the very next request.
    revalidateTag(CONTENT_TAG, { expire: 0 })
  } catch (err) {
    // Never let a cache purge break a save — the worst case is stale content
    // until the next change, and the editor keeps their work either way.
    // eslint-disable-next-line no-console
    console.error(`[revalidate:${label}]`, err instanceof Error ? err.message : err)
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ collection, doc }) => {
  purgePublicPages(collection?.slug ?? 'collection')
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ collection, doc }) => {
  purgePublicPages(collection?.slug ?? 'collection')
  return doc
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({ global, doc }) => {
  purgePublicPages(global?.slug ?? 'global')
  return doc
}
