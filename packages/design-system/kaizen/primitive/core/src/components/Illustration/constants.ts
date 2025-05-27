export const ILLUSTRATION_NAMES = [
  "empty",
  "error",
  "no-search",
  "success",
  "warning",
] as const;

export type IllustrationName = (typeof ILLUSTRATION_NAMES)[number];
