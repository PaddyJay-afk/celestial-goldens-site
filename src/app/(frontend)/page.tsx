import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Heart, ClipboardCheck, Users } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { MediaImage } from '@/components/site/media-image'
import { TrustBadges } from '@/components/site/badges'
import { PuppyCard, TestimonialCard } from '@/components/site/cards'
import { EmptyState } from '@/components/site/section'
import {
  getSiteSettings,
  getPublishedPuppies,
  getLitters,
  getTestimonials,
} from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: `${settings.businessName} — English Golden Retrievers in Suffolk, VA`,
    description:
      'A responsible English Golden Retriever breeding program in Suffolk, Virginia. Health-tested parents, family-raised puppies, careful matching, and lifelong support.',
    path: '/',
    settings,
  })
}

export default async function HomePage() {
  const [settings, puppies, litters, testimonials] = await Promise.all([
    getSiteSettings(),
    getPublishedPuppies(),
    getLitters(),
    getTestimonials(true),
  ])

  const available = puppies.filter((p) => p.status !== 'placed').slice(0, 3)
  const featuredLitter =
    litters.find((l) => (l.status === 'expecting' || l.status === 'planned') && l.coverImage) ??
    litters.find((l) => l.coverImage) ??
    litters[0]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-content grid items-center gap-12 pb-12 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-16">
          <Reveal>
            <p className="eyebrow">Suffolk, Virginia · English Golden Retrievers</p>
            <h1 className="mt-5 text-balance text-5xl leading-[1.05] sm:text-6xl">
              One litter a year, raised in my living room.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/80">
              {settings.tagline ??
                'A small, responsible breeding program focused on temperament, health, and matching each puppy to the right family.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/apply" size="lg" variant="primary">
                Apply for a Puppy
              </ButtonLink>
              <ButtonLink href="/available-puppies" size="lg" variant="outline">
                View Available Puppies
              </ButtonLink>
              <ButtonLink href="/our-dogs" size="lg" variant="ghost">
                Meet Our Dogs <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
            <TrustBadges settings={settings} className="mt-10" />
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="relative mx-auto max-w-md">
              <MediaImage
                media={settings.heroImage ?? settings.defaultOgImage}
                size="feature"
                priority
                className="arch-top aspect-[3/4] w-full rounded-b-2xl shadow-lift"
                placeholderLabel="Add a hero photo in Site Settings → Brand"
              />
              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-forest/10 bg-cream px-5 py-4 shadow-soft sm:block">
                <p className="font-display text-2xl text-forest">Raised underfoot</p>
                <p className="text-sm text-charcoal/70">ENS · sound work · potty training</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Responsible breeding message */}
      <section className="border-y border-forest/10 bg-ivory">
        <div className="container-content grid gap-8 py-14 md:grid-cols-3">
          {[
            {
              icon: Heart,
              title: 'One litter a year',
              body: 'I raise a single litter each year. Both parents are DNA tested, with OFA hips, elbows, heart, and yearly eye exams. Small on purpose — that’s what doing it right takes.',
            },
            {
              icon: ClipboardCheck,
              title: 'We talk before anything else',
              body: 'Fill out my application completely, then we talk on the phone. There is no deposit and no promise until I’ve told you that you’re approved.',
            },
            {
              icon: Users,
              title: 'Prepared like my own',
              body: 'Your puppy comes home vet-examined, vaccinated, started on potty training, and carrying a small blanket that smells like mom and the litter. Then I stay in your corner for the dog’s whole life.',
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 90} className="flex flex-col gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-soft/40 text-gold-dark">
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="text-xl">{item.title}</h2>
              <p className="text-charcoal/75">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Available puppies preview */}
      <section className="container-content py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Looking for a puppy</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Available & upcoming puppies</h2>
          </div>
          <Link href="/available-puppies" className="text-sm font-semibold text-gold-dark link-underline">
            See all puppies →
          </Link>
        </div>
        <div className="mt-8">
          {available.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {available.map((p) => (
                <PuppyCard key={p.id} puppy={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No puppies listed right now"
              body="I raise one litter a year, and every puppy is spoken for by families who applied early. Apply now to be considered for the next litter."
              cta={
                <ButtonLink href="/apply" variant="primary">
                  Apply for a Puppy
                </ButtonLink>
              }
            />
          )}
        </div>
      </section>

      {/* Featured litter */}
      {featuredLitter && (
        <section className="border-y border-forest/10 bg-forest text-cream">
          <div className="container-content grid items-center gap-10 py-16 lg:grid-cols-2">
            <Reveal>
              <p className="eyebrow text-gold-soft">Featured litter</p>
              <h2 className="mt-3 text-3xl text-cream sm:text-4xl">{featuredLitter.name}</h2>
              {featuredLitter.description && (
                <p className="mt-4 max-w-lg text-cream/80">{featuredLitter.description}</p>
              )}
              <div className="mt-6">
                <ButtonLink href="/upcoming-litters" variant="gold">
                  View upcoming litters
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <MediaImage
                media={featuredLitter.coverImage}
                size="feature"
                className="aspect-[4/3] w-full rounded-2xl shadow-lift"
                placeholderLabel="Litter photo coming soon"
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* Testimonials preview */}
      {testimonials.length > 0 && (
        <section className="container-content py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">From my families</p>
              <h2 className="mt-3 text-3xl sm:text-4xl">Loved in their new homes</h2>
            </div>
            <Link href="/testimonials" className="text-sm font-semibold text-gold-dark link-underline">
              Read more →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-content pb-8">
        <div className="rounded-3xl border border-forest/10 bg-ivory px-6 py-14 text-center shadow-soft sm:px-12">
          <h2 className="mx-auto max-w-2xl text-3xl sm:text-4xl">
            Ready to start the conversation?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-charcoal/75">
            Tell me about your home and what you’re looking for. I read every application
            myself, and we’ll talk on the phone before anything is decided.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/apply" size="lg" variant="primary">
              Apply for a Puppy
            </ButtonLink>
            <ButtonLink href="/process" size="lg" variant="outline">
              See how it works
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
