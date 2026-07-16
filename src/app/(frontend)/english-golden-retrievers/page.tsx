import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ui/button'
import { PageHeader, Section } from '@/components/site/section'
import { getSiteSettings } from '@/lib/data'
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo'
import { serverUrl } from '@/lib/env'

const PATH = '/english-golden-retrievers'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: 'English Golden Retriever (English Cream) — Complete Breed Guide',
    description:
      'What an English Golden Retriever really is, how “English Cream” differs from American goldens, the health testing responsible breeders do, and how to choose a breeder — from a one-litter-a-year breeder in Suffolk, VA.',
    path: PATH,
    settings,
  })
}

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-12 text-2xl text-forest sm:text-3xl">{children}</h2>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-4 leading-relaxed text-charcoal/85">{children}</p>
)
const Pull = ({ children }: { children: React.ReactNode }) => (
  <blockquote className="mt-6 border-l-2 border-gold pl-5 font-display text-lg italic text-forest/90">
    {children}
  </blockquote>
)

export default async function BreedGuidePage() {
  const settings = await getSiteSettings()

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'English Golden Retriever (English Cream) — Complete Breed Guide',
    description:
      'A practical guide to English Golden Retrievers: type, temperament, health testing, grooming, and how to choose a responsible breeder.',
    author: {
      '@type': 'Person',
      name: settings.breederName ?? 'Pamela',
      jobTitle: 'English Golden Retriever breeder',
      worksFor: { '@id': `${serverUrl}/#business` },
    },
    publisher: { '@id': `${serverUrl}/#business` },
    mainEntityOfPage: `${serverUrl}${PATH}`,
  }
  const crumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'English Golden Retriever Breed Guide', path: PATH },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      <PageHeader
        eyebrow="Breed Guide"
        title="The English Golden Retriever, explained"
        intro="Everything families ask me about the breed — what “English Cream” actually means, how these dogs differ from American goldens, what testing responsible breeders do, and how to tell a good breeder from a good website."
      />

      <Section className="max-w-3xl">
        <article>
          <H2>What is an English Golden Retriever?</H2>
          <P>
            An English Golden Retriever is a Golden Retriever bred to the British (KC/FCI)
            standard rather than the American (AKC) standard. You&rsquo;ll hear them called
            &ldquo;English Cream,&rdquo; &ldquo;European,&rdquo; or &ldquo;platinum&rdquo; goldens —
            those are marketing names for the same thing: a golden of English type. They are not a
            separate breed, and no honest breeder will tell you they are. What is different is the
            <em> type</em>: English-line goldens tend to be stockier, with blockier heads, straighter
            toplines, and coats that run from pale cream to light gold.
          </P>
          <Pull>
            The color is the least important thing about them. I breed for temperament and health —
            the pale coat is just the suit my dogs happen to wear.
          </Pull>

          <H2>English vs. American goldens — the honest version</H2>
          <P>
            Temperament differences are real but often oversold. Well-bred goldens of either type are
            gentle, biddable family dogs. English lines are frequently described as a touch calmer
            and more mellow indoors; American lines as a touch more driven and athletic. The
            individual pedigree matters far more than the label — which is why you should ask any
            breeder about the temperaments of the actual parents, not the continent of their
            ancestors. Mine live in my living room, and their puppies are matched to families by the
            temperament I observe, not by promises.
          </P>

          <H2>Health, and the testing that actually matters</H2>
          <P>
            Goldens as a breed face hip and elbow dysplasia, heart conditions, eye disease, and —
            their heaviest burden — cancer. No breeder can promise a puppy will never be sick. What a
            responsible breeder can do is test every parent and show you the results. For my dogs
            that means a DNA panel plus OFA evaluations of hips, elbows, and heart, and OFA eye exams
            repeated every single year — because eyes can change, and a certificate from three years
            ago tells you nothing. You can verify any breeder&rsquo;s OFA results yourself in the
            public database at ofa.org; a breeder who hesitates to give you registered names has
            answered your question.
          </P>

          <H2>Living with one</H2>
          <P>
            Expect 55&ndash;75 pounds of devoted shadow. English goldens are famously soft-natured:
            eager to please, gentle with children, terrible guard dogs, and happiest wherever you
            are. They need real daily exercise — a long walk, a swim, a game of fetch — and their
            dense double coat needs brushing a few times a week plus tolerance for seasonal shedding.
            They are chewers as puppies and food-motivated forever, which makes them wonderfully easy
            to train and wonderfully easy to overfeed. Plan on a quality large-breed puppy food
            (mine go home on Royal Canin Golden Retriever Puppy) and slow, joint-friendly growth.
          </P>

          <H2>How to choose a breeder — anywhere, not just here</H2>
          <P>
            Whether you get a puppy from me or from someone three states away, hold every breeder to
            the same bar. You should be able to see where the puppies are raised — in person or on a
            live video call, not just photos. Both parents should have verifiable health testing, not
            &ldquo;vet checked.&rdquo; There should be an application and a real conversation before
            anyone takes your money. Puppies should stay until at least eight weeks. There should be
            a written contract, and a take-back promise for the dog&rsquo;s whole life. And be wary
            of anyone who always has puppies available: good programs are small, and good puppies are
            waited for.
          </P>
          <Pull>
            I raise one litter a year. If I have nothing available, I&rsquo;ll tell you — and
            I&rsquo;d rather point you to another good breeder than see you rushed into a bad one.
          </Pull>

          <H2>What a well-started puppy looks like</H2>
          <P>
            By go-home day, a thoughtfully raised puppy has had early neurological stimulation as a
            newborn, met the sounds of a real household, started potty training, been examined by a
            veterinarian, and received their first vaccination. That head start is why most of my
            families tell me their puppy was fully house trained within two to two-and-a-half weeks
            of coming home. Ask any breeder you talk to exactly what their puppies have experienced
            before eight weeks — the answer tells you how the whole program is run.
          </P>

          <div className="mt-12 rounded-2xl border border-gold/30 bg-gold-soft/20 p-6 sm:p-8">
            <h2 className="font-display text-2xl text-forest">Think this is your breed?</h2>
            <p className="mt-3 text-charcoal/80">
              Read <a href="/process" className="text-gold-dark underline">how my process works</a>,
              meet <a href="/our-dogs" className="text-gold-dark underline">the dogs behind my puppies</a>,
              or check the <a href="/faq" className="text-gold-dark underline">FAQ</a> for pricing and
              policies. When you&rsquo;re ready, the application is the first step in a conversation
              with me.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/apply" variant="primary" size="lg">
                Apply for a Puppy
              </ButtonLink>
              <ButtonLink href="/available-puppies" variant="outline" size="lg">
                See Available Puppies
              </ButtonLink>
            </div>
          </div>
        </article>
      </Section>
    </>
  )
}
