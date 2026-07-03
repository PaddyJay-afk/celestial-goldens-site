import * as React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import type { SiteSetting } from '@/payload-types'
import { footerPrimary, footerSecondary } from './nav-links'

const locationLabel = (s: SiteSetting): string => {
  if (s.addressVisibility === 'full' && s.streetAddress) {
    return [s.streetAddress, `${s.city ?? ''}, ${s.state ?? ''} ${s.postalCode ?? ''}`.trim()]
      .filter(Boolean)
      .join(', ')
  }
  if (s.addressVisibility === 'hidden') return ''
  return `${s.city ?? 'Suffolk'}, ${s.state ?? 'VA'}`
}

export const Footer = ({ settings }: { settings: SiteSetting }) => {
  const year = new Date().getFullYear()
  const location = locationLabel(settings)

  return (
    <footer className="mt-24 border-t border-forest/10 bg-forest text-cream/90">
      <div className="container-content grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <p className="font-display text-2xl text-cream">{settings.businessName}</p>
          {settings.tagline && (
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">{settings.tagline}</p>
          )}
          {settings.showBreederName && settings.breederName && (
            <p className="mt-4 text-sm text-cream/60">Bred with care by {settings.breederName}</p>
          )}
        </div>

        <nav aria-label="Footer — puppies">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">Puppies</h2>
          <ul className="mt-4 space-y-2.5">
            {footerPrimary.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-cream/80 hover:text-cream">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer — program">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">Program</h2>
          <ul className="mt-4 space-y-2.5">
            {footerSecondary.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-cream/80 hover:text-cream">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-sm text-cream/80">
            {location && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                <span>{location}</span>
              </li>
            )}
            {settings.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gold-soft" />
                <a href={`mailto:${settings.email}`} className="hover:text-cream">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold-soft" />
                <a href={`tel:${settings.phone}`} className="hover:text-cream">
                  {settings.phone}
                </a>
              </li>
            )}
          </ul>
          <div className="mt-5 flex gap-3">
            {settings.facebook && (
              <a href={settings.facebook} aria-label="Facebook" className="text-cream/70 hover:text-cream" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} aria-label="Instagram" className="text-cream/70 hover:text-cream" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {settings.youtube && (
              <a href={settings.youtube} aria-label="YouTube" className="text-cream/70 hover:text-cream" target="_blank" rel="noopener noreferrer">
                <Youtube className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-content flex flex-col gap-2 py-6 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.businessName}. All rights reserved.
          </p>
          <p className="max-w-xl sm:text-right">
            AKC-registered English Golden Retrievers · one litter a year · Suffolk, Virginia
          </p>
        </div>
      </div>
    </footer>
  )
}
