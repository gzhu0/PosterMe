/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,css}"
  ],
  theme: {
    extend: {
      transitionDuration: {
        1500: "1500ms",
      },
    },
  },
  plugins: [],
}
