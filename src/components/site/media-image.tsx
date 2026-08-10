import * as React from 'react'
import type { Media } from '@/payload-types'
import { asMedia } from '@/lib/data'
import { cn } from '@/lib/utils'

type SizeKey = 'thumbnail' | 'card' | 'feature' | 'hero' | 'og'

/**
 * Responsive image for Payload media. Builds a srcset from the generated image
 * sizes, lazy-loads by default, and degrades to a tasteful placeholder when no
 * image is set. Plain <img> keeps it robust across storage adapters.
 */
export const MediaImage = ({
  media,
  size = 'card',
  className,
  imgClassName,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 768px',
  placeholderLabel = 'Photo coming soon',
}: {
  media: unknown
  size?: SizeKey
  className?: string
  imgClassName?: string
  priority?: boolean
  sizes?: string
  placeholderLabel?: string
}) => {
  const m = asMedia(media) as Media | null

  if (!m?.url) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-sage/15 to-gold-soft/30 text-sage',
          className,
        )}
        aria-hidden="true"
      >
        <span className="px-4 text-center font-display text-sm italic text-forest/70">
          {placeholderLabel}
        </span>
      </div>
    )
  }

  const sizesObj = m.sizes ?? {}
  const candidates: { url: string; width: number }[] = []
  for (const key of ['thumbnail', 'card', 'feature', 'hero'] as const) {
    const s = sizesObj[key]
    if (s?.url && s?.width) candidates.push({ url: s.url, width: s.width })
  }
  const srcSet = candidates.length
    ? candidates.map((c) => `${c.url} ${c.width}w`).join(', ')
    : undefined

  const chosen = sizesObj[size]?.url ?? m.url

  return (
    <div className={cn('overflow-hidden bg-sage/10', className)}>
      <img
        src={chosen}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={m.alt ?? ''}
        width={m.width ?? undefined}
        height={m.height ?? undefined}
        loading={priority ? 'eager' : 'lazy'}
        // Tells the browser to fetch the hero ahead of other subresources
        // rather than at default priority; it is usually the LCP element.
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </div>
  )
}
