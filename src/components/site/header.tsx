'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { navLinks } from './nav-links'
import { ButtonLink } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Header = ({ businessName }: { businessName: string }) => {
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])


  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled
          ? 'border-forest/10 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80'
          : 'border-transparent bg-cream/0',
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>
      <div className="container-content flex min-h-20 items-center justify-between gap-4 py-3">
        <Link
          href="/"
          className="group min-w-0 max-w-[calc(100%-3.5rem)] flex-1 items-center gap-3"
          aria-label={`${businessName} — home`}
        >
          <span className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold/40 bg-midnight shadow-soft ring-2 ring-cream transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/brand/celestial-mark.webp"
              alt=""
              aria-hidden="true"
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="block min-w-0 max-w-[15rem] line-clamp-2 font-display text-lg font-semibold leading-tight tracking-tight text-forest sm:max-w-[19rem] sm:text-2xl">
            {businessName}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navLinks.slice(0, 6).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'link-underline text-sm font-medium text-charcoal/80 transition-colors hover:text-forest',
                pathname === link.href && 'text-forest',
              )}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href="/apply" variant="primary" size="sm">
            Apply for a Puppy
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-forest hover:bg-forest/5 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-forest/10 bg-cream lg:hidden">
          <nav className="container-content flex flex-col gap-1 py-4" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-xl px-3 py-3 text-base font-medium text-charcoal/85 hover:bg-forest/5',
                  pathname === link.href && 'bg-forest/5 text-forest',
                )}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink href="/apply" variant="primary" className="mt-2 w-full" onClick={() => setOpen(false)}>
              Apply for a Puppy
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  )
}

