import type { Metadata } from 'next'
import { FileText, Download } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { PageHeader, Section } from '@/components/site/section'
import { RichText } from '@/components/site/rich-text'
import { getPageBySlug, getPublicDocuments, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

const SLUG = 'health-guarantee'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getPageBySlug(SLUG)])
  return buildMetadata({
    title: page?.title ?? 'Health Guarantee & Contract',
    description:
      page?.subtitle ??
      'A plain-language overview of our health guarantee and puppy contract. Request the full documents anytime.',
    path: `/${SLUG}`,
    seo: page?.seo,
    settings,
  })
}

const POINTS = [
  'Puppies are examined by our veterinarian and vet-checked before they go home.',
  'Puppies go home with age-appropriate vaccinations and deworming, and a health record.',
  'We provide a written health guarantee and a puppy contract covering health and care expectations.',
  'We ask buyers to complete an initial vet visit within a set window after go-home.',
  'If you ever cannot keep your dog, we ask that the dog be returned to us.',
]

export default async function HealthGuaranteePage() {
  const [page, docs] = await Promise.all([getPageBySlug(SLUG), getPublicDocuments()])
  const contract = docs.find((d) => d.category === 'contract')
  const guarantee = docs.find((d) => d.category === 'health-guarantee')

  return (
    <>
      <PageHeader
        eyebrow="Health Guarantee"
        title={page?.title ?? 'Our health guarantee & contract'}
        intro={
          page?.subtitle ??
          'Here’s a plain-language summary of what we stand behind. The full contract and health guarantee spell out the details.'
        }
      />

      <Section>
        {page?.body ? (
          <RichText data={page.body} />
        ) : (
          <ul className="space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-xl border border-forest/10 bg-ivory px-5 py-4">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                <span className="text-charcoal/85">{p}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Puppy contract', doc: contract },
            { label: 'Health guarantee', doc: guarantee },
          ].map(({ label, doc }) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl border border-forest/10 bg-ivory p-5 shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-soft/40 text-gold-dark">
                <FileText className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-forest">{label}</p>
                {doc?.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm text-gold-dark link-underline"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-charcoal/60">Available on request.</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-gold/30 bg-gold-soft/20 p-6">
          <h2 className="font-display text-xl text-forest">Want the full documents?</h2>
          <p className="mt-2 text-sm text-charcoal/80">
            We’re happy to share the complete contract and health guarantee so you can read
            every detail before you commit.
          </p>
          <div className="mt-4">
            <ButtonLink href="/contact?subject=Request%20full%20contract" variant="primary">
              Request full contract
            </ButtonLink>
          </div>
        </div>

        <p className="mt-8 text-sm text-charcoal/60">
          This summary is general information, not legal or veterinary advice. The signed
          contract and health guarantee are the governing documents.
        </p>
      </Section>
    </>
  )
}
