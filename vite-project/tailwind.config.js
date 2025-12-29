/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        romantic: {
          50: "#fff0f1",
          100: "#ffe0e3",
          200: "#ffc1c7",
          300: "#ff929e",
          400: "#ff5468",
          500: "#f71d39",
          600: "#e30d2a",
          700: "#c0061f",
          800: "#a0081d",
          900: "#850d1e",
          950: "#4a020b",
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};
