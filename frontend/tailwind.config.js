const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"

  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light:{
        colors:{}
      },
      dark:{
        colors: {
          primary: {
            DEFAULT: "#00A6B1",
            foreground: "#000000",
          },
          teal: {
            700: "#006F77"
          }
        },
      }
    }
  })]
}