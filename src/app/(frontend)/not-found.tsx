import { ButtonLink } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section className="container-content flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl sm:text-5xl">This page wandered off</h1>
      <p className="mt-4 max-w-md text-charcoal/75">
        The page you’re looking for can’t be found. Let’s get you back to the goldens.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" variant="primary">
          Back home
        </ButtonLink>
        <ButtonLink href="/available-puppies" variant="outline">
          View available puppies
        </ButtonLink>
      </div>
    </section>
  )
}
