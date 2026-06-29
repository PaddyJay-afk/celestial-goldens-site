import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ui/button'
import { PageHeader, Section } from '@/components/site/section'
import { Reveal } from '@/components/ui/reveal'
import { getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: 'How It Works',
    description:
      'Our placement process, step by step: learn, apply, review, talk, approve, match, go home, and lifelong support.',
    path: '/process',
    settings,
  })
}

const STEPS = [
  { title: 'Learn about the program', body: 'Read about our dogs, our practices, and what life with an English Golden is like. Bring your questions.' },
  { title: 'Submit an application', body: 'Tell us about your home, your experience, and what you’re hoping for. It takes about 10–15 minutes.' },
  { title: 'Breeder review', body: 'We read every application personally and consider fit — not order of arrival.' },
  { title: 'Call, visit, or video chat', body: 'We’ll talk so we can answer questions and make sure this is the right match both ways.' },
  { title: 'Approved deposit', body: 'Once we’ve approved a match, we send a deposit link to hold your place. Deposits are never taken before approval.' },
  { title: 'Puppy matching', body: 'As the litter develops, we match temperaments to families. We help guide the choice.' },
  { title: 'Go-home day', body: 'Your puppy comes home vet-checked, with a go-home packet and starter supplies.' },
  { title: 'Lifelong support', body: 'We stay in touch for the life of your dog, for advice and celebration alike.' },
]

export default async function ProcessPage() {
  return (
    <>
      <PageHeader
        eyebrow="How It Works"
        title="From first hello to go-home day"
        intro="Our process is built around getting the match right. Here’s exactly what to expect."
      />

      <Section>
        <ol className="relative space-y-8 border-l border-forest/15 pl-8">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} as="li" delay={(i % 4) * 70} className="relative">
              <span className="absolute -left-[2.55rem] flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-cream font-display text-sm font-semibold text-gold-dark">
                {i + 1}
              </span>
              <h2 className="font-display text-xl text-forest">{step.title}</h2>
              <p className="mt-1.5 max-w-2xl text-charcoal/75">{step.body}</p>
            </Reveal>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/apply" size="lg" variant="primary">
            Start your application
          </ButtonLink>
          <ButtonLink href="/faq" size="lg" variant="outline">
            Read the FAQ
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
