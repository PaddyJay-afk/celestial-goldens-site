import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/(frontend)/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6EC',
        ivory: '#FFF9EA',
        midnight: '#020814',
        celestial: {
          DEFAULT: '#081A2D',
          700: '#102A44',
          500: '#43586A',
          silver: '#DDEAF2',
        },
        forest: {
          DEFAULT: '#20362A',
          50: '#EDF3EA',
          700: '#2F4A39',
          900: '#112117',
        },
        sage: {
          DEFAULT: '#63A8A2',
          light: '#A3D0CC',
        },
        gold: {
          DEFAULT: '#D7B56D',
          dark: '#9E762E',
          soft: '#F1D993',
        },
        charcoal: '#14231B',
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
        soft: '0 2px 8px rgba(2, 8, 20, 0.06), 0 12px 30px rgba(2, 8, 20, 0.07)',
        lift: '0 8px 18px rgba(2, 8, 20, 0.12), 0 24px 56px rgba(2, 8, 20, 0.16)',
        celestial: '0 20px 60px rgba(2, 8, 20, 0.35), 0 0 38px rgba(215, 181, 109, 0.16)',
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
  plugins: [require('@tailwindcss/typography')],
}

export default config
