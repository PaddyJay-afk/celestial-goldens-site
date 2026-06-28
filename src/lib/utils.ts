import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const formatDate = (value?: string | Date | null): string => {
  if (!value) return ''
  const d = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Map a known collar-color name to a CSS color for the puppy-card dot motif. */
export const collarColorToCss = (name?: string | null): string => {
  if (!name) return '#BD8B3C'
  const key = name.toLowerCase().trim()
  const map: Record<string, string> = {
    red: '#B4452F',
    pink: '#D98FA6',
    orange: '#D08A3E',
    yellow: '#E0C04A',
    green: '#6B7F5E',
    blue: '#5B7C99',
    purple: '#7E6A9E',
    teal: '#4F8C86',
    white: '#F3EFE6',
    black: '#2C2A25',
    grey: '#9A968C',
    gray: '#9A968C',
    brown: '#8A6A4A',
  }
  for (const [k, v] of Object.entries(map)) {
    if (key.includes(k)) return v
  }
  return '#BD8B3C'
}

export const titleCase = (s: string): string =>
  s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
