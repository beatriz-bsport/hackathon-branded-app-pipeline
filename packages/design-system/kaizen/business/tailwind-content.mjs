// Export the content paths that consumers should include in their Tailwind config
// This ensures that Tailwind classes used in kaizen-business-components are properly scanned and included
//
// NOTE: The path "node_modules/@bsport/kaizen-business-components/src/**" works because pnpm creates
// symlinks in node_modules that point to the actual workspace package source files.
// This allows Tailwind to scan the original TypeScript/JSX files during build time.
export const KAIZEN_BUSINESS_CONTENT_PATHS = [
  "node_modules/@bsport/kaizen-business-components/src/**/*.{js,ts,jsx,tsx}",
];
