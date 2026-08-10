import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/app/(frontend)/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAFAF7',
        ivory: '#FFFFFF',
        forest: {
          DEFAULT: '#134E5A',
          50: '#EAF3F3',
          700: '#1B646F',
          900: '#0C3841',
        },
        sage: {
          DEFAULT: '#63A8A2',
          light: '#A3D0CC',
        },
        gold: {
          // Decorative only (rules, borders, focus rings) — never text or a
          // text background: 2.52:1 on cream is below every WCAG threshold.
          DEFAULT: '#C29A3B',
          // Text-safe gold. Darkened from #A17E27, which read as gold but only
          // reached 3.63:1 on cream and 3.80:1 under white — both short of the
          // 4.5:1 AA floor, and the eyebrow/link text using it is small.
          // This is 5.50:1 on cream and 5.75:1 under white.
          dark: '#7E621C',
          // Hover state for gold-dark surfaces.
          900: '#6B5316',
          soft: '#EAD9AD',
        },
        charcoal: '#243538',
        muted: '#5C6F71',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(19, 78, 90, 0.06), 0 12px 30px rgba(19, 78, 90, 0.06)',
        lift: '0 8px 18px rgba(19, 78, 90, 0.10), 0 20px 48px rgba(19, 78, 90, 0.10)',
      },
      maxWidth: {
        content: '72rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [typography],
}

export default config
