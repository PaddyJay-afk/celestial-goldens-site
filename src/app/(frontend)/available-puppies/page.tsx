import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ui/button'
import { PageHeader, Section, EmptyState } from '@/components/site/section'
import { PuppyCard } from '@/components/site/cards'
import { Reveal } from '@/components/ui/reveal'
import { getPublishedPuppies, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: 'Available English Golden Retriever Puppies',
    description:
      'Current and upcoming English Golden Retriever puppies in Suffolk, VA. Each placement begins with an application — there is no instant checkout.',
    path: '/available-puppies',
    settings,
  })
}

export default async function AvailablePuppiesPage() {
  const puppies = await getPublishedPuppies()
  const active = puppies.filter((p) => p.status !== 'placed')
  const placed = puppies.filter((p) => p.status === 'placed')

  return (
    <>
      <PageHeader
        eyebrow="Available Puppies"
        title="Puppies looking for their families"
        intro="Availability changes often and placements are made by application, not first-come checkout. If you see a puppy you love, apply or ask — we’ll talk with you about the right match."
      />

      <Section>
        {active.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 80}>
                <PuppyCard puppy={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No puppies are listed right now"
            body="We breed in small numbers and list puppies only when a litter is on the way or here. Apply to join the conversation for an upcoming litter."
            cta={
              <ButtonLink href="/apply" variant="primary">
                Apply for a Puppy
              </ButtonLink>
            }
          />
        )}

        {placed.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl text-forest">Recently placed</h2>
            <p className="mt-2 text-charcoal/70">
              These sweethearts have found their families. They’re here so you can see the
              kind of puppies we raise.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {placed.map((p) => (
                <PuppyCard key={p.id} puppy={p} />
              ))}
            </div>
          </div>
        )}
      </Section>
    </>
  )
}
