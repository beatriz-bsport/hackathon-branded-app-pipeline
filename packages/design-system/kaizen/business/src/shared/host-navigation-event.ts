/**
 * Dispatched after programmatic URL updates so host shells (e.g. navigation sidebar)
 * can react via `useCurrentPathname` / `useCurrentSearch`.
 */
export const HOST_NAVIGATION_EVENT = "navigation" as const;
