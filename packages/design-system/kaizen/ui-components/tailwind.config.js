// const TOKENS = require("./src/tailwindcss/tailwind-variables.js");
const THEME = require("./tailwind.theme.json");

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: THEME,
  content: ["./src/components/**/*.{html,ts,tsx}"],
  darkMode: "selector",
};
