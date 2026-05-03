/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        gold: '#C9A96E',
        'gold-light': '#E8D5B0',
        'gold-dark': '#A8824A',
        burgundy: '#8B1A2D',
        'burgundy-dark': '#6B1323',
        'burgundy-light': '#B02540',
        ink: '#2C2C2C',
        'ink-light': '#6B6B6B',
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
        'hero-gradient': 'linear-gradient(135deg, #1a0a0f 0%, #4a0f1a 40%, #8B1A2D 70%, #C9A96E 100%)',
      },
    },
  },
  plugins: [],
}

