import { tailwindConfig } from "@bsport/kaizen-primitive-core";

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
};
