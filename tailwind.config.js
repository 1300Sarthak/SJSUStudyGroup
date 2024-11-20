/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sjsu-blue': '#0055A2',
        'sjsu-gold': '#E5A823',
      }
    },
  },
  plugins: [],
}