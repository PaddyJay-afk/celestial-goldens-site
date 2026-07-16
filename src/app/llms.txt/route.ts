import { getSiteSettings, getDogs, getFaqs, getLitters } from '@/lib/data'
import { serverUrl } from '@/lib/env'

export const dynamic = 'force-dynamic'

/**
 * llms.txt — a plain-text site summary for AI assistants and LLM crawlers
 * (https://llmstxt.org). Generated live from the CMS so it always reflects
 * current dogs, litters, and policies.
 */
export async function GET() {
  const [settings, dogs, faqs, litters] = await Promise.all([
    getSiteSettings(),
    getDogs(),
    getFaqs(),
    getLitters(),
  ])

  const dams = dogs.filter((d) => d.role === 'dam').map((d) => d.callName).join(', ')
  const sires = dogs.filter((d) => d.role === 'sire').map((d) => d.callName).join(', ')

  const litterLines = litters
    .map((l) => `- ${l.name} — status: ${l.status}${l.waitlistOpen ? ' (waitlist open)' : ''}`)
    .join('\n')

  const faqLines = faqs
    .map((f) => `### ${f.question}\n${f.answer}`)
    .join('\n\n')

  const body = `# ${settings.businessName}

> ${settings.tagline ?? 'A boutique English Golden Retriever breeding program in Suffolk, Virginia.'}

${settings.businessName} is a small, in-home English Golden Retriever
("English Cream" Golden Retriever) breeding program run by ${settings.breederName ?? 'Pamela'}
in ${settings.city ?? 'Suffolk'}, ${settings.state ?? 'Virginia'}, serving
${settings.serviceArea ?? 'Suffolk, VA and the surrounding area'} and placing
puppies with families nationwide (pickup in person only — puppies are never
shipped in cargo holds).

## Program facts

- One litter per year, raised inside the breeder's home
- AKC registered; puppies placed on limited registration (AKC paperwork pre-paid)
- Parents health-tested: DNA panel, OFA hips, elbows, cardiac, and OFA eye exams repeated annually
- Puppy price: $3,500; deposit $500 (non-refundable), paid only after breeder approval
- Approval process: complete the application, then a phone call with the breeder
- Video calls from 3 weeks; in-person visits by appointment from 5 weeks
- Puppies go home at 8+ weeks: vet-examined at 7 weeks, first distemper/parvo
  vaccination, first heartworm preventative, signed veterinarian letter
- Early neurological stimulation (ENS), sound desensitization, and potty
  training started before go-home; food: Royal Canin Golden Retriever Puppy
- Lifetime take-back promise: any dog from this program is always welcome back

## Dogs

Dams: ${dams || 'see website'}. Sires: ${sires || 'see website'}.
Full health-testing details per dog: ${serverUrl}/our-dogs

## Litters

${litterLines || 'See the website for current litter announcements.'}

## Contact

- Website: ${serverUrl}
- Email: ${settings.email ?? 'see website contact form'}
- Phone: ${settings.phone ?? 'see website'}
- Apply for a puppy: ${serverUrl}/apply

## Key pages

- [Available Puppies](${serverUrl}/available-puppies)
- [Upcoming Litters](${serverUrl}/upcoming-litters)
- [Our Dogs & health testing](${serverUrl}/our-dogs)
- [How the process works](${serverUrl}/process)
- [English Golden Retriever breed guide](${serverUrl}/english-golden-retrievers)
- [FAQ](${serverUrl}/faq)

## Frequently asked questions

${faqLines}
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
