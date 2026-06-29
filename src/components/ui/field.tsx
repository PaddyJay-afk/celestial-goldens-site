import * as React from 'react'
import { cn } from '@/lib/utils'

const baseControl =
  'w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5 text-charcoal shadow-sm outline-none transition-colors placeholder:text-charcoal/40 focus:border-gold focus:ring-2 focus:ring-gold/30 disabled:opacity-60'

export const Field = ({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
  className?: string
}) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <label htmlFor={htmlFor} className="text-sm font-medium text-forest">
      {label}
      {required && <span className="ml-0.5 text-gold-dark">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-charcoal/55">{hint}</p>}
    {error && (
      <p className="text-xs font-medium text-red-700" role="alert">
        {error}
      </p>
    )}
  </div>
)

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(baseControl, className)} {...props} />
  ),
)
Input.displayName = 'Input'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(baseControl, 'min-h-28 resize-y', className)} {...props} />
))
Textarea.displayName = 'Textarea'

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(baseControl, 'appearance-none', className)} {...props}>
    {children}
  </select>
))
Select.displayName = 'Select'

export const Checkbox = ({
  id,
  label,
  required,
  error,
  ...props
}: {
  id: string
  label: React.ReactNode
  required?: boolean
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="flex items-start gap-3 text-sm text-charcoal/90">
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 h-5 w-5 shrink-0 rounded border-forest/30 text-forest focus:ring-2 focus:ring-gold/40"
        {...props}
      />
      <span>
        {label}
        {required && <span className="ml-0.5 text-gold-dark">*</span>}
      </span>
    </label>
    {error && (
      <p className="text-xs font-medium text-red-700" role="alert">
        {error}
      </p>
    )}
  </div>
)

/** Visually-hidden honeypot field — real users never see or fill it. */
export const Honeypot = ({ name = 'website' }: { name?: string }) => (
  <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
    <label htmlFor={name}>Leave this field empty</label>
    <input id={name} name={name} type="text" tabIndex={-1} autoComplete="off" />
  </div>
)
