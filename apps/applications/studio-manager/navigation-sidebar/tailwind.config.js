import { KAIZEN_BUSINESS_CONTENT_PATHS } from "@bsport/kaizen-business-components/tailwind-content";
import { tailwindConfig } from "@bsport/kaizen-primitive-core";
import { SM_BACKBONE_CONTENT_PATHS } from "@bsport/sm-backbone/tailwind-content";

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ...SM_BACKBONE_CONTENT_PATHS,
    ...KAIZEN_BUSINESS_CONTENT_PATHS,
    // Scan Kaizen primitive-core source so this app's Tailwind pass emits the full
    // primitive utility set (incl. longhands like the menu-item `pr-md`) in canonical
    // order. The sidebar's CSS is injected last via module federation; without `pr-md`
    // here, its `.p-2xs` padding shorthand clobbers Kaizen's `.pr-md` longhand on
    // portaled components (e.g. the inbox filter's selected-option box → uneven padding).
    "node_modules/@bsport/kaizen-primitive-core/src/**/*.{js,ts,jsx,tsx}",
  ],
};
