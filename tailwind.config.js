/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Ensure the paths are correct for your project
  theme: {
    extend: {
      animation: {
        'fade-in-out': 'fadeInOut 2s infinite', // Custom animation name
      },
      keyframes: {
        fadeInOut: {
          '0%, 100%': { opacity: '0' }, // Invisible at the start and end
          '50%': { opacity: '1' }, // Fully visible at the midpoint
        },
      },
      colors: {
        tealish: "#fd3000", // Custom color for #85ceba
        minty: "#fd3000", // Custom color for #cce2dc
      },
    },
  },
  plugins: [],
};
