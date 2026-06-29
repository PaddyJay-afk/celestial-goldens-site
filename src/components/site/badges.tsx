import * as React from 'react'
import { Award, HeartPulse, Dna, Stethoscope, Home } from 'lucide-react'
import type { SiteSetting } from '@/payload-types'
import { cn } from '@/lib/utils'

const ICONS = { Award, HeartPulse, Dna, Stethoscope, Home }

export const TrustBadges = ({
  settings,
  className,
}: {
  settings: SiteSetting
  className?: string
}) => {
  const badges: { on: boolean | null | undefined; label: string; icon: keyof typeof ICONS }[] = [
    { on: settings.badgeAkc, label: 'AKC registered', icon: 'Award' },
    { on: settings.badgeOfa, label: 'OFA health testing', icon: 'HeartPulse' },
    { on: settings.badgeEmbark, label: 'Genetic testing', icon: 'Dna' },
    { on: settings.badgeVetChecked, label: 'Vet-checked', icon: 'Stethoscope' },
    { on: settings.badgeFamilyRaised, label: 'Family-raised', icon: 'Home' },
  ]
  const active = badges.filter((b) => b.on)
  if (!active.length) return null

  return (
    <ul className={cn('flex flex-wrap gap-x-6 gap-y-3', className)}>
      {active.map((b) => {
        const Icon = ICONS[b.icon]
        return (
          <li key={b.label} className="flex items-center gap-2 text-sm font-medium text-forest">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft/40 text-gold-dark">
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            {b.label}
          </li>
        )
      })}
    </ul>
  )
}
