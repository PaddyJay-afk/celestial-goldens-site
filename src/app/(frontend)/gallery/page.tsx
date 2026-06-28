import type { Metadata } from 'next'
import { PageHeader, Section, EmptyState } from '@/components/site/section'
import { MediaImage } from '@/components/site/media-image'
import { getGalleryImages, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: 'Gallery',
    description: 'Photos of our English Golden Retrievers, puppies, and the families they’ve joined.',
    path: '/gallery',
    settings,
  })
}

export default async function GalleryPage() {
  const images = await getGalleryImages(60)

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="A look at our goldens"
        intro="Moments from our home and our families — parents, puppies, and the people who love them."
      />

      <Section>
        {images.length ? (
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
            {images.map((img) => (
              <figure key={img.id} className="break-inside-avoid overflow-hidden rounded-xl border border-forest/10 bg-ivory">
                <MediaImage media={img} size="card" className="w-full" imgClassName="object-cover" />
                {img.caption && (
                  <figcaption className="px-3 py-2 text-xs text-charcoal/60">{img.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Photos coming soon"
            body="We’re curating a gallery of our dogs and puppies. Check back shortly."
          />
        )}
      </Section>
    </>
  )
}
