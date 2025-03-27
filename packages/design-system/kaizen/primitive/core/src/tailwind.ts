import type { Config } from "tailwindcss";

import THEME from "@bsport/kaizen-tokens/src/tailwind.theme.json";

/**
 * Sensible base configuration for Tailwind if using Kaizen.
 */
export const tailwindConfig: Config = {
  // Do not edit the theme directly as it is auto-generated from tokens
  theme: THEME,
  darkMode: "selector",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
};
