// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // <- this is important for Tailwind to scan
  ],
  theme: {
    extend: {
      colors: { "kemnaker-blue": "#2F8AFD", "kemnaker-light": "#59C7FF" },
    },
  },
  plugins: [],
};
