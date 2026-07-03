import type { Metadata } from 'next'
import { PageHeader, Section } from '@/components/site/section'
import { ApplicationForm } from '@/components/site/application-form'
import { getPuppyBySlug, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: 'Puppy Application',
    description:
      'Apply for an English Golden Retriever puppy from a responsible breeder in Suffolk, VA. Applications are reviewed personally; deposits follow approval.',
    path: '/apply',
    settings,
  })
}

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ puppy?: string }>
}) {
  const sp = await searchParams
  const puppySlug = sp.puppy ?? ''
  const puppy = puppySlug ? await getPuppyBySlug(puppySlug) : null

  return (
    <>
      <PageHeader
        eyebrow="Puppy Application"
        title="Apply for a puppy"
        intro={
          puppy
            ? `You’re applying with ${puppy.name} in mind. Tell me about your home — then we’ll talk about whether it’s the right match.`
            : 'This is how every one of my puppies finds their family. Answer every question — complete applications are the first thing I look for — and I read every word myself.'
        }
      />

      <Section className="max-w-3xl">
        {puppy && (
          <p className="mb-6 rounded-xl border border-gold/30 bg-gold-soft/20 px-4 py-3 text-sm text-charcoal/80">
            Applying about <strong className="text-forest">{puppy.name}</strong>
            {puppy.collarColor ? ` (${puppy.collarColor})` : ''}.
          </p>
        )}
        <ApplicationForm puppySlug={puppySlug} />
      </Section>
    </>
  )
}
