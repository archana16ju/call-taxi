/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/app/(frontend)/**/*.{js,ts,jsx,tsx}",
    "./src/app/(payload)/**/*.{js,ts,jsx,tsx}",
    "./src/payload/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}