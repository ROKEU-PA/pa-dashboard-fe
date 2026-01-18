// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // <- this is important for Tailwind to scan
  ],
  theme: {
    extend: {
      colors: {
        "kemnaker-blue": "#59C7FF",
        "kemnaker-light": "#59C7FF",
        neon: "#BCDD51",
        "neon-bg": "#EDF6D0",
      },
    },
  },
  plugins: [],
};
