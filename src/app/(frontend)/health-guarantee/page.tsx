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
  'At seven weeks, every puppy has a full veterinary exam and their first distemper/parvovirus vaccination.',
  'Each puppy goes home with their first heartworm preventative, to be given after homecoming.',
  'Every puppy comes with a letter from our veterinarian confirming they have been examined — accepted for pet insurance.',
  'Your contract and a copy of your application come home in the go-home packet.',
  'If you ever cannot keep your dog, the dog comes back to us — always.',
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
          'No fine print here. Before your puppy ever leaves my home, a licensed veterinarian has examined them — and you get that in writing.'
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
                  <p className="mt-1 text-sm text-charcoal/70">Available on request.</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-gold/30 bg-gold-soft/20 p-6">
          <h2 className="font-display text-xl text-forest">Want the full documents?</h2>
          <p className="mt-2 text-sm text-charcoal/80">
            I’m happy to walk you through the contract line by line before you commit —
            that conversation is part of my process, not an extra.
          </p>
          <div className="mt-4">
            <ButtonLink href="/contact?subject=Request%20full%20contract" variant="primary">
              Request full contract
            </ButtonLink>
          </div>
        </div>

        <p className="mt-8 text-sm text-charcoal/70">
          Your signed contract is the governing document — you and I go through it together
          before go-home day.
        </p>
      </Section>
    </>
  )
}
