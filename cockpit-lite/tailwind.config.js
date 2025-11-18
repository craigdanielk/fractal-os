/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        glass: {
          light: 'rgba(255,255,255,0.35)',
          heavy: 'rgba(255,255,255,0.55)',
          dark: 'rgba(25,25,25,0.45)',
          'dark-heavy': 'rgba(25,25,25,0.65)',
        },
      },
      boxShadow: {
        glass: '0 12px 40px rgba(0,0,0,0.18)',
        'glass-dark': '0 12px 40px rgba(0,0,0,0.35)',
        glow: '0 0 18px rgba(10,132,255,0.35)',
      },
    },
  },
  plugins: [],
}

