'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Reveals children with a gentle fade-up as they scroll into view.
 *
 * The server renders children **visible**. An earlier version started every
 * Reveal at `opacity-0` and only revealed it once React had hydrated and an
 * IntersectionObserver had fired — which meant the first screenful of text was
 * invisible until JavaScript ran. On a throttled mobile connection that pushed
 * largest-contentful-paint out by roughly two seconds, and left the page blank
 * for anyone whose JavaScript failed or was slow.
 *
 * Now the fade is opt-in per element and only applied to content that starts
 * below the fold, decided after mount. Above-the-fold content is never hidden,
 * so it costs nothing on first paint; below-the-fold content is off-screen when
 * it is hidden, so there is no visible flash. With JavaScript off, or reduced
 * motion requested, everything simply stays visible.
 */
export const Reveal = ({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: keyof React.JSX.IntrinsicElements
}) => {
  const ref = React.useRef<HTMLDivElement | null>(null)
  // 'static' = never animated (server render, reduced motion, above the fold).
  const [phase, setPhase] = React.useState<'static' | 'hidden' | 'shown'>('static')

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Already in view (or above it) on load: leave it alone so first paint and
    // LCP are unaffected.
    if (node.getBoundingClientRect().top < window.innerHeight) return

    setPhase('hidden')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPhase('shown')
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(node)

    // Safety net: content must never stay hidden (odd browsers, bfcache).
    const fallback = window.setTimeout(() => setPhase('shown'), 2000)
    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  const Component = Tag as React.ElementType
  return (
    <Component
      ref={ref}
      style={phase === 'static' ? undefined : { transitionDelay: `${delay}ms` }}
      className={cn(
        phase !== 'static' && 'transition-all duration-700 ease-out',
        phase === 'hidden' && 'translate-y-4 opacity-0',
        className,
      )}
    >
      {children}
    </Component>
  )
}
