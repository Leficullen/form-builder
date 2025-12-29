/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          yellow: "var(--primary-yellow)",
          pink: "var(--primary-pink)",
          red: "var(--primary-red)",
        },
      },
      borderColor: {
        primary: "var(--primary-border)",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      animation: {
        blob: "blob 7s infinite",
        "gradient-flow": "gradient-flow 3s linear infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        "gradient-flow": {
          "0%": { "background-position": "0% 0%" },
          "100%": { "background-position": "0% 100%" },
        },
      },
    },
  },
  plugins: [],
};
