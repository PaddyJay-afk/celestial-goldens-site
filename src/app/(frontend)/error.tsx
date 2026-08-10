'use client'

import { useEffect } from 'react'
import { Button, ButtonLink } from '@/components/ui/button'

/**
 * Error boundary for the public site.
 *
 * Without this, a transient failure — most likely the database restarting
 * during a deploy or a backup — shows visitors an unstyled framework error
 * page. Families arriving from a search result should see the brand and a way
 * to reach Pamela instead, and should never see a stack trace.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Server-side details stay on the server; the digest correlates this view
    // with the logged error without exposing anything to the visitor.
    console.error('[frontend:error]', error.digest ?? error.message)
  }, [error])

  return (
    <section className="container-content flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-4 text-4xl sm:text-5xl">We’ll be right back</h1>
      <p className="mt-4 max-w-md text-charcoal/75">
        This page didn’t load properly. It’s usually temporary — please try
        again in a moment. If you were sending a message, nothing was lost.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={reset} variant="primary">
          Try again
        </Button>
        <ButtonLink href="/" variant="outline">
          Back home
        </ButtonLink>
      </div>
    </section>
  )
}
