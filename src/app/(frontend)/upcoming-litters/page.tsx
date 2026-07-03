import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ui/button'
import { PageHeader, Section, EmptyState } from '@/components/site/section'
import { LitterCard } from '@/components/site/cards'
import { Reveal } from '@/components/ui/reveal'
import { getLitters, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: 'Upcoming English Golden Retriever Litters — Suffolk, VA',
    description:
      'Planned and expected English Golden Retriever litters in Suffolk, VA, with sire and dam information and waitlist status.',
    path: '/upcoming-litters',
    settings,
  })
}

export default async function UpcomingLittersPage() {
  const litters = await getLitters(['planned', 'expecting', 'born', 'available', 'reserved'])

  return (
    <>
      <PageHeader
        eyebrow="Upcoming Litters"
        title="Planned & expected litters"
        intro="One litter a year — planned carefully, announced here first. Talk to me early: the waitlist is how families are considered when puppies arrive."
      />

      <Section>
        {litters.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {litters.map((l, i) => (
              <Reveal key={l.id} delay={(i % 2) * 90}>
                <LitterCard litter={l} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No litters announced yet"
            body="I plan one litter a year and announce it here. Apply to be considered before it’s spoken for."
            cta={
              <ButtonLink href="/apply" variant="primary">
                Apply for a Puppy
              </ButtonLink>
            }
          />
        )}

        <div className="mt-12 rounded-2xl border border-gold/30 bg-gold-soft/20 p-6">
          <h2 className="font-display text-xl text-forest">A note on expectations</h2>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
            Nature decides much of this. Timing, litter size, coat color, sex, and
            temperament are in her hands, not mine. I share my best plans here and keep
            them updated as things unfold.
          </p>
        </div>
      </Section>
    </>
  )
}
