/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1C74E9",
        "primary-dark": "#1363A5",
        "primary-light": "#4AA0F9",
        accent: "#F48C06",
      },
    },
  },
  plugins: [],
};
