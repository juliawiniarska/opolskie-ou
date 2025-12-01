/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandNavy: "#0A1628",
        brandGreen: "#2D7A5F",
      },
    },
  },
  plugins: [],
};
