/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      Inter: ["Inter", "sans-serif"],
      Montserrat: ["Montserrat", "sans-serif"],
    },
    extend: {
      screens: {
        custom: "702px",
        customVideoView: "1450px",
      },
    },
    plugins: [require("@tailwindcss/aspect-ratio")],
  },
};
