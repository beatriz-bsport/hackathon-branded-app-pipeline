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
  ],
};
