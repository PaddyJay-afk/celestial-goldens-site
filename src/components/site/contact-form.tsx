'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Field, Input, Textarea, Honeypot } from '@/components/ui/field'

type Errors = Record<string, string[] | undefined>

export const ContactForm = ({ defaultSubject = '' }: { defaultSubject?: string }) => {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errors, setErrors] = React.useState<Errors>({})
  const [message, setMessage] = React.useState('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setErrors({})
    setMessage('')

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (res.ok && json.ok) {
        setStatus('success')
        form.reset()
        return
      }
      if (json.errors) setErrors(json.errors)
      setMessage(json.message ?? 'Please correct the highlighted fields.')
      setStatus('error')
    } catch {
      setMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-sage/40 bg-sage/10 p-8 text-center">
        <h2 className="font-display text-2xl text-forest">Message sent</h2>
        <p className="mt-2 text-charcoal/75">
          Thank you for reaching out. I’ll reply as soon as I can — it really is me.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" required error={errors.name?.[0]}>
          <Input id="name" name="name" autoComplete="name" required />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email?.[0]}>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone?.[0]}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </Field>
        <Field label="Subject" htmlFor="subject" error={errors.subject?.[0]}>
          <Input id="subject" name="subject" defaultValue={defaultSubject} />
        </Field>
      </div>
      <Field label="Message" htmlFor="message" required error={errors.message?.[0]}>
        <Textarea id="message" name="message" required />
      </Field>

      {status === 'error' && message && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {message}
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}
