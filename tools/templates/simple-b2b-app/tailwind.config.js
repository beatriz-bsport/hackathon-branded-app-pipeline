import { TAILWIND_THEME } from "@bsport/kaizen-primitive-core";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: TAILWIND_THEME,
  darkMode: "selector",
};
