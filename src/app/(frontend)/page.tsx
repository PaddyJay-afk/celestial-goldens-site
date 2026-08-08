import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowRight, Heart, ClipboardCheck, Users, Moon } from 'lucide-react'
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
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
        <div className="container-content grid items-center gap-12 pb-12 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-16">
          <Reveal>
            <p className="eyebrow moon-divider">Suffolk, Virginia · English Golden Retrievers</p>
            <h1 className="mt-5 text-balance text-5xl leading-[1.05] sm:text-6xl">
              Beautiful golden puppies, raised with purpose and placed with care.
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
            <div className="mt-8 grid max-w-xl gap-3 text-sm text-charcoal/75 sm:grid-cols-3">
              {['Health-tested parents', 'One litter a year', 'Lifetime support'].map((label) => (
                <span key={label} className="rounded-full border border-gold/30 bg-ivory/70 px-3 py-2 text-center shadow-soft">
                  ✦ {label}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -right-5 -top-6 z-10 hidden h-28 w-28 overflow-hidden rounded-full border border-gold/50 bg-midnight shadow-celestial ring-4 ring-cream sm:block">
                <Image
                  src="/brand/celestial-mark.webp"
                  alt="Celestial English Golden Retrievers logo mark"
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="arch-top relative aspect-[3/4] w-full overflow-hidden rounded-b-2xl border border-gold/30 shadow-lift">
                <Image
                  src="/images/hero-english-golden.webp"
                  alt="Cream English Golden Retriever in a Virginia meadow at golden hour"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-gold/30 bg-cream px-5 py-4 shadow-soft sm:block">
                <p className="font-display text-2xl text-forest">Ethically raised</p>
                <p className="text-sm text-charcoal/70">ENS · sound work · thoughtful matching</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Editorial photography — generic program imagery, never named as a specific dog. */}
      <section className="container-content py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-gold/25 shadow-soft">
                <Image src="/images/home-raised-litter.webp" alt="Cream Golden Retriever puppies resting in a clean home nursery" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
              </div>
              <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-3xl border border-gold/25 shadow-soft">
                <Image src="/images/early-socialization.webp" alt="Cream Golden Retriever puppy exploring safe enrichment equipment" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow">Raised at home</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Confident puppies begin with thoughtful early experiences.</h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/75">
              From gentle handling and household sounds to age-appropriate surfaces and
              problem-solving, every day is planned to help puppies meet the world with curiosity.
            </p>
            <ButtonLink href="/responsible-breeding" variant="outline" className="mt-7">
              See how puppies are raised <ArrowRight className="h-4 w-4" />
            </ButtonLink>
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

      {/* Match quiz teaser */}
      <section className="container-content pb-4 pt-12">
        <Reveal>
          <div className="celestial-panel rounded-3xl border border-gold/25 px-6 py-8 text-cream shadow-celestial sm:px-8">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="eyebrow text-gold-soft">Find your celestial match</p>
                <h2 className="mt-3 text-3xl text-cream sm:text-4xl">A guided puppy-matching experience</h2>
                <p className="mt-3 max-w-3xl text-cream/75">
                  Families can answer a few lifestyle questions and share the temperament profile that best fits their home — calm companion, bright explorer, gentle star, or cuddly moon.
                </p>
              </div>
              <ButtonLink href="/apply" variant="gold" size="lg">
                Start the application <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </Reveal>
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
        <section className="celestial-panel border-y border-gold/20 text-cream">
          <div className="container-content grid items-center gap-10 py-16 lg:grid-cols-2">
            <Reveal>
              <p className="eyebrow text-gold-soft">Featured litter</p>
              <h2 className="mt-3 text-3xl text-cream sm:text-4xl">{featuredLitter.name}</h2>
              {featuredLitter.description && (
                <p className="mt-4 max-w-lg text-cream/80">{featuredLitter.description}</p>
              )}
              <div className="mt-7 grid gap-3 text-sm text-cream/75 sm:grid-cols-3">
                {[
                  ['New moon', 'Application'],
                  ['Half moon', 'Temperament notes'],
                  ['Full moon', 'Go-home prep'],
                ].map(([phase, label]) => (
                  <div key={phase} className="rounded-2xl border border-cream/15 bg-cream/10 p-4 backdrop-blur">
                    <Moon className="mb-2 h-5 w-5 text-gold-soft" />
                    <p className="font-semibold text-cream">{phase}</p>
                    <p>{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <ButtonLink href="/upcoming-litters" variant="gold">
                  View upcoming litters
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-midnight p-3 shadow-celestial">
                <MediaImage
                  media={featuredLitter.coverImage}
                  size="feature"
                  className="aspect-[4/3] w-full rounded-2xl"
                  placeholderLabel="Litter photo coming soon"
                />
                <div className="absolute right-5 top-5 rounded-full border border-gold/40 bg-midnight/75 px-4 py-2 text-sm text-gold-soft backdrop-blur">
                  ✦ Moon-phase litter journey
                </div>
              </div>
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
            Ready to start your puppy journey?
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
