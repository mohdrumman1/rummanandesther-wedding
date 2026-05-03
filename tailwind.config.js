/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6F0',
        gold: '#C9A96E',
        'gold-light': '#E5D4A8',
        'gold-dark': '#9E7B3C',
        burgundy: '#722F37',
        'burgundy-dark': '#4A1E24',
        'burgundy-light': '#A0535D',
        ink: '#2A1F1A',
        'ink-light': '#6B5A52',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'ultra': '0.25em',
        'extreme': '0.4em',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(160deg, #4A1E24 0%, #722F37 40%, #9E7B3C 75%, #FAF6F0 100%)',
      },
    },
  },
  plugins: [],
}

