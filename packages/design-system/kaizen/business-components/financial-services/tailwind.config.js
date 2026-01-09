import THEME from "@bsport/kaizen-tokens/src/tailwind.theme.json" with { type: "json" };

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    ...THEME,
    extend: {},
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "selector",
  plugins: [],
};
