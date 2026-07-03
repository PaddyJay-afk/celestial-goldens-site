'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Field, Input, Textarea, Select, Checkbox, Honeypot } from '@/components/ui/field'

type Errors = Record<string, string[] | undefined>

const FieldsetHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="border-b border-forest/10 pb-2">
    <h2 className="font-display text-xl text-forest">{children}</h2>
  </div>
)

export const ApplicationForm = ({ puppySlug = '' }: { puppySlug?: string }) => {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errors, setErrors] = React.useState<Errors>({})
  const [message, setMessage] = React.useState('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setErrors({})
    setMessage('')

    const form = e.currentTarget
    const fd = new FormData(form)
    const data: Record<string, unknown> = Object.fromEntries(fd.entries())
    // Checkboxes → booleans
    data.agreement = fd.get('agreement') === 'on'
    data.contactConsent = fd.get('contactConsent') === 'on'

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (res.ok && json.ok) {
        setStatus('success')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (json.errors) setErrors(json.errors)
      setMessage(json.message ?? 'Please correct the highlighted fields and try again.')
      setStatus('error')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-sage/40 bg-sage/10 p-8 text-center">
        <h2 className="font-display text-2xl text-forest">Application received</h2>
        <p className="mx-auto mt-3 max-w-md text-charcoal/75">
          Thank you. I read every application myself, and the next step is a phone call —
          that’s how you’ll know if you’ve been approved. Check your inbox for a
          confirmation.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-10">
      <Honeypot />
      <input type="hidden" name="puppy" defaultValue={puppySlug} />

      {status === 'error' && message && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {message}
        </p>
      )}

      <fieldset className="space-y-5">
        <FieldsetHeading>About you</FieldsetHeading>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="applicantName" required error={errors.applicantName?.[0]}>
            <Input id="applicantName" name="applicantName" autoComplete="name" required />
          </Field>
          <Field label="Email" htmlFor="email" required error={errors.email?.[0]}>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </Field>
          <Field label="Phone" htmlFor="phone" required error={errors.phone?.[0]}>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" required />
          </Field>
          <Field label="City, State" htmlFor="cityState" required error={errors.cityState?.[0]}>
            <Input id="cityState" name="cityState" placeholder="e.g. Richmond, VA" required />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <FieldsetHeading>Your household</FieldsetHeading>
        <Field
          label="Who lives in your home?"
          htmlFor="householdMembers"
          required
          error={errors.householdMembers?.[0]}
          hint="Adults and children who’ll share the home with the puppy."
        >
          <Textarea id="householdMembers" name="householdMembers" required />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Children & ages" htmlFor="children" error={errors.children?.[0]}>
            <Input id="children" name="children" placeholder="e.g. 8 and 11, or none" />
          </Field>
          <Field label="Other pets" htmlFor="otherPets" error={errors.otherPets?.[0]}>
            <Input id="otherPets" name="otherPets" placeholder="Species, ages, temperament" />
          </Field>
          <Field label="Housing type" htmlFor="housingType" required error={errors.housingType?.[0]}>
            <Select id="housingType" name="housingType" defaultValue="" required>
              <option value="" disabled>
                Choose one…
              </option>
              <option value="house">House</option>
              <option value="townhouse">Townhouse</option>
              <option value="apartment">Apartment / Condo</option>
              <option value="farm">Farm / Acreage</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Yard / fence" htmlFor="yardFence" error={errors.yardFence?.[0]}>
            <Select id="yardFence" name="yardFence" defaultValue="">
              <option value="">Prefer not to say</option>
              <option value="fenced">Fenced yard</option>
              <option value="unfenced">Unfenced yard</option>
              <option value="none">No yard</option>
            </Select>
          </Field>
        </div>
        <Field
          label="Work schedule & hours alone"
          htmlFor="workSchedule"
          required
          error={errors.workSchedule?.[0]}
          hint="How many hours would the puppy be alone on a typical day?"
        >
          <Textarea id="workSchedule" name="workSchedule" required />
        </Field>
      </fieldset>

      <fieldset className="space-y-5">
        <FieldsetHeading>Experience & plans</FieldsetHeading>
        <Field label="Prior dog experience" htmlFor="priorExperience" required error={errors.priorExperience?.[0]}>
          <Textarea id="priorExperience" name="priorExperience" required />
        </Field>
        <Field
          label="Veterinarian reference"
          htmlFor="vetReference"
          error={errors.vetReference?.[0]}
          hint="Clinic name and phone, if you have one."
        >
          <Input id="vetReference" name="vetReference" />
        </Field>
        <Field label="Lifestyle & activity level" htmlFor="activityLevel" required error={errors.activityLevel?.[0]}>
          <Textarea id="activityLevel" name="activityLevel" required />
        </Field>
        <Field label="Training plan" htmlFor="trainingPlan" required error={errors.trainingPlan?.[0]}>
          <Textarea id="trainingPlan" name="trainingPlan" required />
        </Field>
        <Field label="Why an English Golden Retriever?" htmlFor="whyBreed" required error={errors.whyBreed?.[0]}>
          <Textarea id="whyBreed" name="whyBreed" required />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Desired timing"
            htmlFor="desiredTiming"
            required
            error={errors.desiredTiming?.[0]}
            hint="When would you hope to bring a puppy home?"
          >
            <Input id="desiredTiming" name="desiredTiming" placeholder="e.g. Spring 2026, flexible" required />
          </Field>
          <Field label="Sex preference" htmlFor="sexPreference" error={errors.sexPreference?.[0]}>
            <Select id="sexPreference" name="sexPreference" defaultValue="either">
              <option value="either">Either</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <FieldsetHeading>Agreements</FieldsetHeading>
        <Checkbox
          id="agreement"
          name="agreement"
          required
          error={errors.agreement?.[0]}
          label="I’ve read and agree to responsible-ownership expectations, including lifelong care, proper veterinary attention, and returning the dog to the breeder if I can no longer keep them."
        />
        <Checkbox
          id="contactConsent"
          name="contactConsent"
          required
          error={errors.contactConsent?.[0]}
          label="I consent to being contacted about my application by phone, email, or text."
        />
      </fieldset>

      <Button type="submit" size="lg" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting…' : 'Submit application'}
      </Button>
      <p className="text-xs text-charcoal/55">
        Submitting an application is the first step in a conversation with me — it is not a
        purchase and does not reserve a puppy. Complete applications are the ones I consider.
      </p>
    </form>
  )
}
