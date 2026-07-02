/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: '#faf9f6',
        accent: '#1e3a5f',
        brand: {
          600: '#1e3a5f',
          700: '#152a45',
        },
      },
    },
  },
  plugins: [],
}
