/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  // Source files should be formatted and then linted
  "*.{ts,tsx,js,jsx}": [
    "prettier --write",
    (files) => `nx affected:lint --files="${files.join(",")}"`,
    (files) => `nx affected:lint-old --files="${files.join(",")}"`,
  ],

  // Other files should not be linted, only formatted
  "*.{cjs,mjs,scss,css,json,md,mdx,html,svg}": ["prettier --write"],

  // Format pnpm-lock.yaml
  "pnpm-lock.yaml": [() => "pnpm i -w --lockfile-only --ignore-scripts"],

  // Sort package.json entries
  "package.json": ["sort-package-json"],
};
