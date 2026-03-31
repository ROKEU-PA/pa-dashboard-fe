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
        "green-bg": "#EDF6D0",
        "green-text": "#8EBA01",

        "blue-bg": "#D5F1FF",
        "blue-text": "#2F8AFD",

        "orange-bg": "#FFF3D0",
        "orange-text": "#FFBE02",

        "red-bg": "#FFCFE2",
        "red-text": "#FC0166",
      },
    },
  },
  plugins: [],
};
