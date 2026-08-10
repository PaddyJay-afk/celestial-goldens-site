import type { Metadata } from 'next'
import { Mail, Phone, MapPin } from 'lucide-react'
import { PageHeader, Section } from '@/components/site/section'
import { ContactForm } from '@/components/site/contact-form'
import { getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: 'Contact',
    description: `Get in touch with ${settings.businessName}, an English Golden Retriever breeder in ${settings.city ?? 'Suffolk'}, ${settings.state ?? 'VA'}.`,
    path: '/contact',
    settings,
  })
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>
}) {
  const [settings, sp] = await Promise.all([getSiteSettings(), searchParams])

  const location =
    settings.addressVisibility === 'full' && settings.streetAddress
      ? `${settings.streetAddress}, ${settings.city ?? ''}, ${settings.state ?? ''} ${settings.postalCode ?? ''}`
      : settings.addressVisibility === 'hidden'
        ? null
        : `${settings.city ?? 'Suffolk'}, ${settings.state ?? 'VA'}`

  const mapQuery = encodeURIComponent(
    settings.addressVisibility === 'full' && settings.streetAddress
      ? `${settings.streetAddress}, ${settings.city ?? 'Suffolk'}, ${settings.state ?? 'VA'}`
      : `${settings.city ?? 'Suffolk'}, ${settings.state ?? 'VA'}`,
  )

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let’s talk"
        intro={`I’d love to hear from you — and yes, it’s really me who answers. Start with the form below, or if you’re ready, go straight to the puppy application. I’m in ${settings.serviceArea ?? 'Suffolk, VA'}.`}
      />

      <Section className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <ContactForm defaultSubject={sp.subject ?? ''} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-forest/10 bg-ivory p-6 shadow-soft">
            <h2 className="font-display text-xl text-forest">Reach me directly</h2>
            <ul className="mt-4 space-y-3 text-sm text-charcoal/85">
              {location && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
                  <span>{location}</span>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-gold-dark" />
                  <a href={`mailto:${settings.email}`} className="link-underline">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-gold-dark" />
                  <a href={`tel:${settings.phone}`} className="link-underline">
                    {settings.phone}
                  </a>
                </li>
              )}
            </ul>
            {!settings.email && !settings.phone && (
              <p className="mt-4 text-sm text-charcoal/70">
                The contact form is the best way to reach me right now.
              </p>
            )}
          </div>

          {settings.addressVisibility !== 'hidden' && (
            <div className="overflow-hidden rounded-2xl border border-forest/10 shadow-soft">
              <iframe
                title={`Map of ${settings.city ?? 'Suffolk'}, ${settings.state ?? 'VA'}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="aspect-[4/3] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </aside>
      </Section>
    </>
  )
}
