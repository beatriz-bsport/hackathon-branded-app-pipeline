/**
 * Pass filter primitive constants.
 *
 * Sub-filter related constants are intentionally absent at this stage
 * and will be reintroduced when sub-filter modules are added.
 */
export const OWNERSHIP_OPTIONS = {
  own: "own",
  doesNotOwn: "does_not_own",
} as const;
