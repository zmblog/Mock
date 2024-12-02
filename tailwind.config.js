/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        'gray-800/80': 'rgba(31, 41, 55, 0.8)',
      },
      blur: {
        "3xl": "64px",
      },
    },
  },
  plugins: [],
};
