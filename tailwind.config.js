/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        handwriting: ['Pacifico', 'cursive'],
      },
      colors: {
        brand: {
          DEFAULT: '#2563eb',
          light: '#3b82f6',
          dark: '#1e40af',
          accent: '#38bdf8',
          muted: '#93c5fd',
        },
        champagne: {
          DEFAULT: '#F3E5AB',
          gold: '#C5A059',
          dark: '#8C7036',
        },
        ebony: {
          DEFAULT: '#0C0C0C',
          light: '#1A1A1A',
        },
        ghost: {
          DEFAULT: '#F9F9F9',
          white: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
}

