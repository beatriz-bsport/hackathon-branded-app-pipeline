/**
 * Custom `window` events used for reactive URL tracking and cross-bundle coordination.
 * Dispatch and listen with these constants so renames stay centralized.
 *
 * `navigation` must stay aligned with {@link HOST_WINDOW_EVENTS} in the payment-flow package.
 */
export const WINDOW_EVENTS = {
  /** History/navigation updates (pushState, replaceState, programmatic navigate). */
  navigation: "navigation",
  /** React Router or host route changes (when dispatched). */
  routechange: "routechange",
} as const;

export type WindowEventName =
  (typeof WINDOW_EVENTS)[keyof typeof WINDOW_EVENTS];
