import { useSyncExternalStore } from "react";

type TailwindBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

const TAILWIND_BREAKPOINTS: Record<TailwindBreakpoint, string> = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

/**
 * React hook that subscribes to CSS media query changes using the native `window.matchMedia` API.
 *
 * Uses `useSyncExternalStore` for efficient subscription management and automatic cleanup.
 * The hook updates component state only when the media query match status changes.
 *
 * @param query - Either a Tailwind breakpoint shorthand (`"sm"`, `"md"`, `"lg"`, `"xl"`, `"2xl"`)
 *                or a custom CSS media query string (e.g., `"(orientation: landscape)"`)
 * @returns `true` if the media query currently matches, `false` otherwise
 *
 * @example
 * // Using Tailwind breakpoint shortcuts
 * const isDesktop = useMatchMedia("lg"); // → matches at ≥1024px
 * const isTablet = useMatchMedia("md");  // → matches at ≥768px
 *
 * @example
 * // Using custom media queries
 * const isLandscape = useMatchMedia("(orientation: landscape)");
 * const isDarkMode = useMatchMedia("(prefers-color-scheme: dark)");
 * const isWideScreen = useMatchMedia("(min-width: 1800px)");
 *
 * @example
 * // Conditional rendering based on breakpoint
 * function Sidebar() {
 *   const isDesktop = useMatchMedia("lg");
 *
 *   return isDesktop ? <DesktopNav /> : <MobileNav />;
 * }
 */
export function useMatchMedia(
  query: TailwindBreakpoint | (string & {}),
): boolean {
  const resolvedQuery = isTailwindBreakpoint(query)
    ? TAILWIND_BREAKPOINTS[query]
    : query;

  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(resolvedQuery);
      mql.addEventListener("change", callback);

      return () => {
        mql.removeEventListener("change", callback);
      };
    },
    () => window.matchMedia(resolvedQuery).matches,
  );
}

function isTailwindBreakpoint(query: string): query is TailwindBreakpoint {
  return query in TAILWIND_BREAKPOINTS;
}
