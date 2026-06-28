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
    title: 'Upcoming Litters',
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
        intro="Here’s what we’re planning and expecting. We’re glad to talk early — being on a waitlist is the best way to be considered when puppies arrive."
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
            body="We plan litters carefully and announce them here. Apply to be considered for a future litter."
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
            temperament cannot be guaranteed. We share our best plans and update them as
            things unfold. This information is general and is not legal or veterinary advice.
          </p>
        </div>
      </Section>
    </>
  )
}
