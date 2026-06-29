import * as React from 'react'
import { cn } from '@/lib/utils'

export const PageHeader = ({
  eyebrow,
  title,
  intro,
  align = 'left',
}: {
  eyebrow?: string
  title: string
  intro?: string
  align?: 'left' | 'center'
}) => (
  <header
    className={cn(
      'container-content pt-16 sm:pt-20',
      align === 'center' && 'text-center',
    )}
  >
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{title}</h1>
    {intro && (
      <p
        className={cn(
          'mt-5 max-w-2xl text-lg leading-relaxed text-charcoal/80',
          align === 'center' && 'mx-auto',
        )}
      >
        {intro}
      </p>
    )}
  </header>
)

export const Section = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) => (
  <section id={id} className={cn('container-content py-12 sm:py-16', className)}>
    {children}
  </section>
)

export const EmptyState = ({
  title,
  body,
  cta,
}: {
  title: string
  body: string
  cta?: React.ReactNode
}) => (
  <div className="rounded-2xl border border-dashed border-forest/20 bg-ivory px-6 py-14 text-center">
    <p className="font-display text-xl text-forest">{title}</p>
    <p className="mx-auto mt-2 max-w-md text-charcoal/70">{body}</p>
    {cta && <div className="mt-6 flex justify-center">{cta}</div>}
  </div>
)
