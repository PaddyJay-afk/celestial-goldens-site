'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Reveals children with a gentle fade-up the first time they scroll into view.
 * Respects prefers-reduced-motion (the global CSS reset neutralizes the animation).
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
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(node)
    // Safety net: content must never stay hidden (slow devices, odd browsers).
    const fallback = window.setTimeout(() => setVisible(true), 1500)
    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  const Component = Tag as React.ElementType
  return (
    <Component
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        className,
      )}
    >
      {children}
    </Component>
  )
}
