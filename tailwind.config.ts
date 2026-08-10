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
          DEFAULT: '#C29A3B',
          dark: '#A17E27',
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
