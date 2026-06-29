import type { Metadata } from 'next'
import { PageHeader, Section } from '@/components/site/section'
import { RichText } from '@/components/site/rich-text'
import { MediaImage } from '@/components/site/media-image'
import { getPageBySlug, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

const SLUG = 'responsible-breeding'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getPageBySlug(SLUG)])
  return buildMetadata({
    title: page?.title ?? 'Responsible Breeding',
    description:
      page?.subtitle ??
      'Our breeding philosophy: health testing, early socialization, veterinary care, and lifelong support.',
    path: `/${SLUG}`,
    seo: page?.seo,
    settings,
    ogFallback: page?.heroImage,
  })
}

const PILLARS = [
  { title: 'Health-first pairings', body: 'We test our breeding dogs and pair them to support sound structure, healthy hips and elbows, and stable temperaments.' },
  { title: 'Raised in our home', body: 'Puppies grow up underfoot — exposed to household sounds, gentle handling, and daily life from day one.' },
  { title: 'Early socialization', body: 'We use age-appropriate enrichment, novel surfaces and sounds, and careful introductions to build confidence.' },
  { title: 'Veterinary care', body: 'Every puppy is examined by our veterinarian, started on age-appropriate vaccines and deworming, and vet-checked before go-home.' },
  { title: 'Buyer education', body: 'We share what we’ve learned about nutrition, training, and grooming so you start out prepared and confident.' },
  { title: 'Lifelong commitment', body: 'We’re here for the life of your dog, and we ask that a puppy always come back to us if you ever cannot keep them.' },
]

export default async function ResponsibleBreedingPage() {
  const page = await getPageBySlug(SLUG)

  return (
    <>
      <PageHeader
        eyebrow="Responsible Breeding"
        title={page?.title ?? 'How we raise our puppies'}
        intro={
          page?.subtitle ??
          'We breed in small numbers with a single goal: healthy, well-adjusted English Golden Retrievers who become beloved family companions.'
        }
      />

      {page?.heroImage && (
        <Section className="pt-8">
          <MediaImage
            media={page.heroImage}
            size="hero"
            className="aspect-[16/7] w-full rounded-2xl shadow-soft"
          />
        </Section>
      )}

      <Section>
        {page?.body ? (
          <RichText data={page.body} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-forest/10 bg-ivory p-6 shadow-soft">
                <h2 className="font-display text-xl text-forest">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{p.body}</p>
              </div>
            ))}
          </div>
        )}

        <p className="mt-10 rounded-xl border border-forest/10 bg-cream px-5 py-4 text-sm text-charcoal/70">
          This page describes our general practices and is not legal or veterinary advice.
          Specific health testing and certifications are listed on each dog’s profile only
          where they have been completed.
        </p>
      </Section>
    </>
  )
}
