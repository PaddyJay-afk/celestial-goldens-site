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
  { title: 'Learn about my program', body: 'Read about my dogs, how I raise puppies, and what life with an English Golden is really like. Bring your questions — I love the good ones.' },
  { title: 'Fill out the application — completely', body: 'Tell me about your home, your experience, and what you’re hoping for. Answer every question; an incomplete application is the one thing I won’t consider.' },
  { title: 'I read it myself', body: 'Every application is read by me, personally. I’m looking for fit, not order of arrival.' },
  { title: 'We talk on the phone', body: 'After your application, you and I talk. Once we’ve done both, I’ll tell you whether you’ve been approved. It’s that direct.' },
  { title: 'Hold your place', body: 'Approved families hold their place with a $500 non-refundable deposit by check or Zelle. I never take a deposit from anyone I haven’t approved.' },
  { title: 'Watch them grow', body: 'Video calls start when puppies are three weeks old. Come meet them in person, by appointment, from five weeks. As they grow, I match temperaments to families.' },
  { title: 'Go-home day', body: 'Your puppy leaves my home vet-examined and vaccinated, with your contract, a toy, potty bags, and a little blanket that smells like mom and the litter. The balance is paid in cash at pickup.' },
  { title: 'For the life of your dog', body: 'You’ll have my number. Use it — for advice, for questions, and for the puppy pictures I genuinely want to see.' },
]

export default async function ProcessPage() {
  return (
    <>
      <PageHeader
        eyebrow="How It Works"
        title="From first hello to go-home day"
        intro="My process is simple and personal, and it’s built around one thing: getting the match right. Here’s exactly what to expect."
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
