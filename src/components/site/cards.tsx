import * as React from 'react'
import Link from 'next/link'
import type { Dog, Litter, Puppy, Testimonial } from '@/payload-types'
import { MediaImage } from './media-image'
import { cn, collarColorToCss, formatDate } from '@/lib/utils'

const PUPPY_STATUS_META: Record<string, { label: string; className: string }> = {
  available: { label: 'Available', className: 'bg-sage/20 text-forest' },
  reserved: { label: 'Reserved', className: 'bg-gold-soft/50 text-gold-dark' },
  'under-evaluation': { label: 'Under Evaluation', className: 'bg-forest/10 text-forest' },
  'waitlist-only': { label: 'Waitlist Only', className: 'bg-forest/10 text-forest' },
  placed: { label: 'Placed', className: 'bg-charcoal/10 text-charcoal/70' },
}

const LITTER_STATUS_META: Record<string, { label: string; className: string }> = {
  planned: { label: 'Planned', className: 'bg-forest/10 text-forest' },
  expecting: { label: 'Expecting', className: 'bg-gold-soft/50 text-gold-dark' },
  born: { label: 'Born', className: 'bg-sage/20 text-forest' },
  available: { label: 'Available', className: 'bg-sage/20 text-forest' },
  reserved: { label: 'Fully reserved', className: 'bg-gold-soft/50 text-gold-dark' },
  placed: { label: 'Placed', className: 'bg-charcoal/10 text-charcoal/70' },
}

export const StatusBadge = ({
  status,
  kind = 'puppy',
}: {
  status: string
  kind?: 'puppy' | 'litter'
}) => {
  const meta = (kind === 'puppy' ? PUPPY_STATUS_META : LITTER_STATUS_META)[status] ?? {
    label: status,
    className: 'bg-forest/10 text-forest',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        meta.className,
      )}
    >
      {meta.label}
    </span>
  )
}

const dogName = (d: unknown): string | null => {
  if (d && typeof d === 'object' && 'callName' in (d as Dog)) return (d as Dog).callName
  return null
}

export const PuppyCard = ({ puppy }: { puppy: Puppy }) => {
  const showInquire = puppy.status !== 'placed'
  const inquireLabel =
    puppy.status === 'available' || puppy.status === 'under-evaluation'
      ? 'Apply for this puppy'
      : 'Ask about this puppy'

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-ivory shadow-soft transition-shadow duration-300 hover:shadow-lift">
      <MediaImage
        media={puppy.featuredImage ?? puppy.photos?.[0]?.image}
        size="card"
        className="aspect-[4/3] w-full"
        imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
        placeholderLabel="Puppy photo coming soon"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 font-display text-xl text-forest">
            {puppy.collarColor && (
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-full ring-2 ring-white"
                style={{ backgroundColor: collarColorToCss(puppy.collarColor) }}
                aria-hidden="true"
              />
            )}
            {puppy.name}
          </h3>
          <StatusBadge status={puppy.status} />
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-y-1.5 text-sm text-charcoal/75">
          <dt className="sr-only">Sex</dt>
          <dd className="capitalize">{puppy.sex}</dd>
          {puppy.color && (
            <>
              <dt className="sr-only">Color</dt>
              <dd>{puppy.color}</dd>
            </>
          )}
          {puppy.dateOfBirth && (
            <>
              <dt className="sr-only">Born</dt>
              <dd>Born {formatDate(puppy.dateOfBirth)}</dd>
            </>
          )}
          {puppy.goHomeDate && (
            <>
              <dt className="sr-only">Go-home</dt>
              <dd>Home {formatDate(puppy.goHomeDate)}</dd>
            </>
          )}
        </dl>
        {puppy.notes && <p className="mt-3 line-clamp-3 text-sm text-charcoal/70">{puppy.notes}</p>}
        {showInquire && (
          <Link
            href={`/apply?puppy=${encodeURIComponent(puppy.slug ?? '')}`}
            className="mt-auto pt-4 text-sm font-semibold text-gold-dark link-underline"
          >
            {inquireLabel} →
          </Link>
        )}
      </div>
    </article>
  )
}

export const DogCard = ({ dog }: { dog: Dog }) => (
  <Link
    href={`/our-dogs#${dog.slug ?? dog.id}`}
    className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-ivory shadow-soft transition-shadow duration-300 hover:shadow-lift"
  >
    <MediaImage
      media={dog.featuredImage ?? dog.gallery?.[0]?.image}
      size="card"
      className="aspect-square w-full"
      imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
      placeholderLabel="Photo coming soon"
    />
    <div className="p-5">
      <h3 className="font-display text-xl text-forest">{dog.callName}</h3>
      {dog.registeredName && <p className="text-sm italic text-charcoal/60">{dog.registeredName}</p>}
      <p className="mt-2 text-sm capitalize text-charcoal/75">
        {dog.sex}
        {dog.color ? ` · ${dog.color}` : ''}
      </p>
    </div>
  </Link>
)

export const LitterCard = ({ litter }: { litter: Litter }) => (
  <article className="rounded-2xl border border-forest/10 bg-ivory p-6 shadow-soft">
    <div className="flex items-start justify-between gap-3">
      <h3 className="font-display text-2xl text-forest">{litter.name}</h3>
      <StatusBadge status={litter.status} kind="litter" />
    </div>
    <dl className="mt-4 grid gap-2 text-sm text-charcoal/80 sm:grid-cols-2">
      {dogName(litter.dam) && (
        <div>
          <dt className="font-semibold text-forest">Dam</dt>
          <dd>{dogName(litter.dam)}</dd>
        </div>
      )}
      {dogName(litter.sire) && (
        <div>
          <dt className="font-semibold text-forest">Sire</dt>
          <dd>{dogName(litter.sire)}</dd>
        </div>
      )}
      {litter.expectedDate && (
        <div>
          <dt className="font-semibold text-forest">Expected</dt>
          <dd>{formatDate(litter.expectedDate)}</dd>
        </div>
      )}
      {litter.goHomeDate && (
        <div>
          <dt className="font-semibold text-forest">Go-home</dt>
          <dd>{formatDate(litter.goHomeDate)}</dd>
        </div>
      )}
    </dl>
    {litter.description && <p className="mt-4 text-sm leading-relaxed text-charcoal/75">{litter.description}</p>}
    <p className="mt-4 text-sm font-medium text-forest">
      {litter.waitlistOpen ? 'Waitlist open — apply to be considered.' : 'Waitlist currently closed.'}
    </p>
  </article>
)

export const TestimonialCard = ({ t }: { t: Testimonial }) => (
  <figure className="flex h-full flex-col rounded-2xl border border-forest/10 bg-ivory p-6 shadow-soft">
    <blockquote className="flex-1 font-display text-lg italic leading-relaxed text-forest/90">
      “{t.quote}”
    </blockquote>
    <figcaption className="mt-5 flex items-center gap-3 border-t border-forest/10 pt-4">
      {t.photo ? (
        <MediaImage media={t.photo} size="thumbnail" className="h-11 w-11 rounded-full" />
      ) : (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-soft/50 font-display text-gold-dark">
          {t.ownerName.charAt(0)}
        </span>
      )}
      <div className="text-sm">
        <p className="font-semibold text-forest">
          {t.ownerName}
          {t.dogName ? ` & ${t.dogName}` : ''}
        </p>
        {t.location && <p className="text-charcoal/60">{t.location}</p>}
      </div>
    </figcaption>
  </figure>
)
