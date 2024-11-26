/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tealish: "#85ceba", // Custom color for #85ceba
        minty: "#cce2dc", // Custom color for #cce2dc
      },
    },
  },
  plugins: [],
};
