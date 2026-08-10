'use client'

import { useEffect } from 'react'

/**
 * Last-resort error boundary.
 *
 * `(frontend)/error.tsx` catches failures inside a page, but it cannot catch a
 * failure in the layout that wraps it — and the layout is exactly where the
 * site settings are loaded, so a database outage fails there first. Without
 * this file that case falls through to the framework's unstyled error screen.
 *
 * It replaces the whole document, so it ships its own <html>/<body> and uses
 * inline styles rather than depending on the stylesheet having loaded.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[global:error]', error.digest ?? error.message)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FBF7EF',
          color: '#2F2A24',
          fontFamily: 'Mulish, ui-sans-serif, system-ui, sans-serif',
          padding: '2rem',
        }}
      >
        <main style={{ maxWidth: '30rem', textAlign: 'center' }}>
          <p
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#8A7B5C',
              margin: 0,
            }}
          >
            Celestial English Golden Retrievers
          </p>
          <h1 style={{ fontSize: '2rem', lineHeight: 1.2, margin: '1rem 0 0' }}>
            We&rsquo;ll be right back
          </h1>
          <p style={{ marginTop: '1rem', lineHeight: 1.6, color: 'rgba(47,42,36,0.75)' }}>
            The site is having a brief problem loading. It&rsquo;s usually over in
            a moment — please try again. If you were sending a message, nothing
            was lost.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '2rem',
              cursor: 'pointer',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: '#2E4635',
              color: '#FBF7EF',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
