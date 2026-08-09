import type { Metadata } from 'next'
import Image from 'next/image'
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
  { title: 'Health before everything', body: 'Both parents are DNA tested, with OFA evaluations of hips, elbows, and heart — and I have their eyes re-examined every single year. Certificates are shown to approved families, not just talked about.' },
  { title: 'One litter a year', body: 'I raise a single, thoughtfully planned litter each year. Small on purpose: every puppy grows up in my living room with real time and real attention, not in a kennel building.' },
  { title: 'Early foundations', body: 'Early neurological stimulation, sound desensitization, and potty training all start here, under my roof. Most of my families tell me their puppy is completely house trained within 2 to 2½ weeks of coming home.' },
  { title: 'Veterinary care', body: 'At seven weeks every puppy is examined by my veterinarian, receives their first distemper/parvo vaccination, and goes home with a signed letter from the vet — the kind pet insurance companies accept.' },
  { title: 'Set up to succeed', body: 'Puppies go home eating Royal Canin Golden Retriever Puppy — the food I trust for their whole first year — with my guidance on feeding, training, and grooming whenever you need it.' },
  { title: 'For the dog’s whole life', body: 'I’m here for the life of your dog. And if life ever changes and you can’t keep them, they come back to me — always. No dog of mine will ever see a shelter.' },
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
          'I raise one litter a year with a single goal: healthy, well-adjusted English Golden Retrievers who become the heart of their families — the way my dogs are the heart of my home.'
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
          Each dog’s completed health testing is listed on their profile, and OFA
          certificates are available to approved families. New to the breed? Start with
          my <a href="/english-golden-retrievers" className="text-gold-dark underline">English Golden Retriever guide</a>.
        </p>

        <div className="mt-14 grid items-center gap-8 rounded-3xl border border-gold/25 bg-ivory p-5 shadow-soft md:grid-cols-2 md:p-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/lifelong-support.webp"
              alt="Cream English Golden Retriever walking calmly on leash along a woodland path"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">A lifelong commitment</p>
            <h2 className="mt-3 text-3xl">The relationship continues after go-home day.</h2>
            <p className="mt-4 leading-relaxed text-charcoal/75">
              Families receive practical guidance as their puppy grows, and every dog always has a safe path back to the breeder if life changes.
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}
