import THEME from "@bsport/kaizen-tokens/src/tailwind.theme.json" with { type: "json" };

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    ...THEME,
    extend: {},
  },
  content: [
    // Include primitive core components (used by business components)
    "../../primitive/core/src/**/*.{js,jsx,ts,tsx}",
    // Include all business component packages, but exclude node_modules
    "../**/src/**/*.{js,jsx,ts,tsx}",
    "!../**/node_modules/**",
  ],
  darkMode: "selector",
  plugins: [],
};
