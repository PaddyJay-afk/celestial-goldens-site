import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/(frontend)/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FBF8F1',
        ivory: '#FEFCF7',
        forest: {
          DEFAULT: '#29382E',
          50: '#EEF1EC',
          700: '#33473A',
          900: '#1C261F',
        },
        sage: {
          DEFAULT: '#7C8C6F',
          light: '#A9B49E',
        },
        gold: {
          DEFAULT: '#BD8B3C',
          dark: '#A0742F',
          soft: '#E7D3A8',
        },
        charcoal: '#2C2A25',
        muted: '#6E6A5F',
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
        soft: '0 2px 8px rgba(41, 56, 46, 0.06), 0 12px 30px rgba(41, 56, 46, 0.06)',
        lift: '0 8px 18px rgba(41, 56, 46, 0.10), 0 20px 48px rgba(41, 56, 46, 0.10)',
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
