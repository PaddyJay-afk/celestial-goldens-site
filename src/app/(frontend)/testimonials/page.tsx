import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ui/button'
import { PageHeader, Section, EmptyState } from '@/components/site/section'
import { TestimonialCard } from '@/components/site/cards'
import { Reveal } from '@/components/ui/reveal'
import { getTestimonials, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: 'Testimonials',
    description: 'Kind words from families who welcomed one of our English Golden Retrievers home.',
    path: '/testimonials',
    settings,
  })
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials(false)

  return (
    <>
      <PageHeader
        eyebrow="Testimonials"
        title="Words from our families"
        intro="The greatest reward of this work is seeing our puppies thrive. Here’s what their families have shared."
      />

      <Section>
        {testimonials.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 70}>
                <TestimonialCard t={t} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Testimonials coming soon"
            body="We’re gathering notes from our families. If you’ve welcomed one of our puppies, we’d love to hear from you."
            cta={
              <ButtonLink href="/contact" variant="primary">
                Share your story
              </ButtonLink>
            }
          />
        )}
      </Section>
    </>
  )
}
