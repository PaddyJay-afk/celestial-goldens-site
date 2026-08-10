import * as React from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-forest text-cream hover:bg-forest-700 shadow-soft hover:shadow-lift',
        // White on the lighter gold is 2.63:1 — unreadable for many people and
        // well under AA. The darker gold carries white text at 5.75:1.
        gold: 'bg-gold-dark text-white hover:bg-gold-900 shadow-soft hover:shadow-lift',
        outline:
          'border border-forest/30 text-forest hover:border-forest hover:bg-forest/5',
        ghost: 'text-forest hover:bg-forest/5',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-13 px-8 py-3.5 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type CommonProps = VariantProps<typeof buttonVariants> & { className?: string }

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & CommonProps
>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
))
Button.displayName = 'Button'

export const ButtonLink = ({
  className,
  variant,
  size,
  href,
  children,
  ...props
}: CommonProps & {
  href: string
  children: React.ReactNode
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) => {
  const classes = cn(buttonVariants({ variant, size }), className)
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
  if (isExternal) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  )
}

export { buttonVariants }
