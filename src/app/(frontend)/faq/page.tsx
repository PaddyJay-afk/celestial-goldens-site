import type { Metadata } from 'next'
import type { Faq } from '@/payload-types'
import { ButtonLink } from '@/components/ui/button'
import { PageHeader, Section, EmptyState } from '@/components/site/section'
import { getFaqs, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: 'English Golden Retriever Breeder FAQ — Price, Process & Health',
    description:
      'Answers about pricing, deposits, waitlists, visits, registration, health testing, pickup, delivery, and puppy care.',
    path: '/faq',
    settings,
  })
}

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  pricing: 'Pricing & Deposits',
  waitlist: 'Waitlist & Visits',
  registration: 'Registration',
  health: 'Health & Testing',
  pickup: 'Pickup & Delivery',
  care: 'Food & Care',
}

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([getFaqs(), getSiteSettings()])

  const grouped = faqs.reduce<Record<string, Faq[]>>((acc, f) => {
    const key = f.category ?? 'general'
    ;(acc[key] ??= []).push(f)
    return acc
  }, {})

  const orderedCategories = Object.keys(CATEGORY_LABELS).filter((c) => grouped[c]?.length)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <>
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PageHeader
        eyebrow="FAQ"
        title="Questions, answered"
        intro="Straight answers, the same ones I give on the phone. If you don’t find yours here, ask me."
      />

      <Section>
        {faqs.length ? (
          <div className="space-y-12">
            {orderedCategories.map((cat) => (
              <div key={cat}>
                <h2 className="text-2xl text-forest">{CATEGORY_LABELS[cat]}</h2>
                <div className="mt-4 divide-y divide-forest/10 overflow-hidden rounded-2xl border border-forest/10 bg-ivory">
                  {grouped[cat]!.map((f) => (
                    <details key={f.id} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-forest">
                        {f.question}
                        <span className="shrink-0 text-gold-dark transition-transform group-open:rotate-45" aria-hidden="true">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-charcoal/80">{f.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="FAQ coming soon"
            body="I’m writing up the questions I answer most. In the meantime, just ask me directly."
            cta={
              <ButtonLink href="/contact" variant="primary">
                Contact {settings.businessName}
              </ButtonLink>
            }
          />
        )}
      </Section>
    </>
  )
}
