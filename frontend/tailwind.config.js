/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue1: "#003ecb",
        white1:"#f9f9f9",
        black1:"#191919",
        blue2:"#0057ff",
        white2:"e8e8e8"
      },
    },
  },
  plugins: [],
}