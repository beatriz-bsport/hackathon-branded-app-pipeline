// Export the content paths that consumers should include in their Tailwind config
// This ensures that Tailwind classes used in sm-backbone are properly scanned and included
//
// NOTE: The path "node_modules/@bsport/sm-backbone/src/**" works because pnpm creates
// symlinks in node_modules that point to the actual workspace package source files.
// This allows Tailwind to scan the original TypeScript/JSX files during build time.
export const SM_BACKBONE_CONTENT_PATHS = [
  "node_modules/@bsport/sm-backbone/src/**/*.{js,ts,jsx,tsx}",
];
