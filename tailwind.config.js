const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'white-cloud': 'var(--white-cloud)',
        primary: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
          950: 'var(--brand-950)',
        },
        bg: {
          default: 'var(--white-cloud)',
          dark: 'var(--bg-dark)',
          primary: 'var(--brand-500)',
          neutral: colors.neutral[400],
          important: colors.red[600],
          success: colors.emerald[400],
        },
        surface: {
          default: colors.white,
          dark: 'var(--surface-dark)',
          primary: 'var(--brand-50)',
          neutral: '#f0f0f0',
          important: colors.red[50],
          success: colors.emerald[50],
        },
        onSurface: {
          default: 'var(--black-carbon)',
          dark: 'var(--onSurface-dark)',
          primary: 'var(--brand-800)',
          neutral: colors.neutral[600],
          important: colors.red[700],
          success: colors.emerald[700],
        },
        border: {
          default: colors.neutral[100],
          primary: 'var(--brand-400)',
          neutral: colors.neutral[400],
          important: colors.red[300],
          success: colors.emerald[200],
        },
        text: {
          default: 'var(--black-carbon)',
          dark: 'var(--text-dark)',
          primary: 'var(--brand-700)',
          neutral: colors.neutral[400],
          important: colors.red[600],
          success: colors.emerald[600],
          defaultInverse: 'var(--white-cloud)',
        },
      },

      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },

    screens: {
      tablet: '768px',
      desktop: '1200px',
    },
  },
  plugins: [],
};

module.exports = config;
