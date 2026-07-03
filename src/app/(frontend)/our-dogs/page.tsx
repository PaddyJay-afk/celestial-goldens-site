import type { Metadata } from 'next'
import type { Dog } from '@/payload-types'
import { PageHeader, Section, EmptyState } from '@/components/site/section'
import { MediaImage } from '@/components/site/media-image'
import { Reveal } from '@/components/ui/reveal'
import { getDogs, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { formatDate } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: 'Our Dogs',
    description:
      'Meet the sires and dams behind our English Golden Retriever program — temperament, pedigree, and health testing.',
    path: '/our-dogs',
    settings,
  })
}

const DogProfile = ({ dog }: { dog: Dog }) => (
  <article id={dog.slug ?? String(dog.id)} className="scroll-mt-28">
    <div className="grid gap-6 rounded-2xl border border-forest/10 bg-ivory p-5 shadow-soft md:grid-cols-[260px_1fr] md:p-6">
      <MediaImage
        media={dog.featuredImage ?? dog.gallery?.[0]?.image}
        size="card"
        className="aspect-square w-full rounded-xl"
        placeholderLabel="Photo coming soon"
      />
      <div>
        <h3 className="font-display text-2xl text-forest">{dog.callName}</h3>
        {dog.registeredName && <p className="text-sm italic text-charcoal/60">{dog.registeredName}</p>}
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-charcoal/80">
          <div className="capitalize">{dog.sex}</div>
          {dog.color && <div>{dog.color}</div>}
          {dog.weight && <div>{dog.weight}</div>}
          {dog.dateOfBirth && <div>Born {formatDate(dog.dateOfBirth)}</div>}
        </dl>
        {dog.temperament && <p className="mt-3 text-sm leading-relaxed text-charcoal/80">{dog.temperament}</p>}
        {dog.titles && (
          <p className="mt-3 text-sm">
            <span className="font-semibold text-forest">Titles & achievements:</span>{' '}
            {dog.titles}
          </p>
        )}
        {dog.healthTesting && dog.healthTesting.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark">
              Health testing
            </h4>
            <ul className="mt-2 grid gap-1.5 text-sm text-charcoal/80 sm:grid-cols-2">
              {dog.healthTesting.map((h, i) => (
                <li key={i} className="flex items-baseline gap-2">
                  <span className="font-medium text-forest">{h.test}</span>
                  {h.result && <span>— {h.result}</span>}
                  {h.link && (
                    <a
                      href={h.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-dark underline"
                    >
                      view
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {dog.pedigreeNotes && (
          <p className="mt-4 text-sm leading-relaxed text-charcoal/70">{dog.pedigreeNotes}</p>
        )}
      </div>
    </div>
  </article>
)

const Group = ({ title, blurb, dogs }: { title: string; blurb: string; dogs: Dog[] }) => {
  if (!dogs.length) return null
  return (
    <div className="mt-12 first:mt-0">
      <h2 className="text-2xl text-forest">{title}</h2>
      <p className="mt-1 max-w-2xl text-charcoal/70">{blurb}</p>
      <div className="mt-6 grid gap-6">
        {dogs.map((d, i) => (
          <Reveal key={d.id} delay={(i % 2) * 80}>
            <DogProfile dog={d} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default async function OurDogsPage() {
  const dogs = await getDogs()
  const sires = dogs.filter((d) => d.role === 'sire')
  const dams = dogs.filter((d) => d.role === 'dam')
  const retired = dogs.filter((d) => d.role === 'retired')

  return (
    <>
      <PageHeader
        eyebrow="Our Dogs"
        title="The dogs behind my puppies"
        intro="Everything I do rests on a few exceptional dogs, chosen for temperament, structure, and health. Every test listed below has actually been done — DNA, OFA hips, elbows, heart, and eyes re-examined every year."
      />

      <Section>
        {dogs.length ? (
          <>
            <Group title="Dams" blurb="My girls — the heart of every litter." dogs={dams} />
            <Group title="Sires" blurb="Chosen to complement my girls — in structure, in health, and in that easy golden temperament." dogs={sires} />
            <Group
              title="Retired"
              blurb="The dogs who built this program, now enjoying a well-earned retirement on the couch."
              dogs={retired}
            />
          </>
        ) : (
          <EmptyState
            title="Dog profiles coming soon"
            body="We’re putting together full profiles for our dogs, including health testing and pedigrees."
          />
        )}
      </Section>
    </>
  )
}
