import * as React from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { asMedia } from '@/lib/data'
import { cn } from '@/lib/utils'

type SizeKey = 'thumbnail' | 'card' | 'feature' | 'hero' | 'og'

/**
 * Responsive image for Payload media. Builds a srcset from the generated image
 * sizes, lazy-loads by default, and degrades to a tasteful placeholder when no
 * image is set. If a requested generated size is absent, use the next best
 * available Payload size before falling back to the original upload URL.
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
        <span className="px-4 text-center font-display text-sm italic text-forest/40">
          {placeholderLabel}
        </span>
      </div>
    )
  }

  const sizesObj = m.sizes ?? {}
  const fallbackOrder: SizeKey[] = [size, 'feature', 'hero', 'card', 'og', 'thumbnail']
  const chosenSize = fallbackOrder.map((key) => sizesObj[key]).find((entry) => entry?.url)
  const chosen = chosenSize?.url ?? m.url
  const width = Number(chosenSize?.width || m.width || 1200)
  const height = Number(chosenSize?.height || m.height || 900)

  return (
    <div className={cn('overflow-hidden bg-sage/10', className)}>
      <Image
        src={chosen}
        sizes={sizes}
        alt={m.alt ?? ''}
        width={width}
        height={height}
        priority={priority}
        unoptimized
        decoding="async"
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </div>
  )
}
