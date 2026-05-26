import { useSyncExternalStore } from "react";

import { WINDOW_EVENTS } from "#src/constants/window-events";

const subscribe = (onStoreChange: () => void) => {
  const handleLocationChange = () => {
    onStoreChange();
  };

  // Listen to popstate (back/forward navigation)
  window.addEventListener("popstate", handleLocationChange);

  // Listen to custom navigation events that might be dispatched
  window.addEventListener(WINDOW_EVENTS.navigation, handleLocationChange);

  // Listen to React Router navigation events (if available)
  window.addEventListener(WINDOW_EVENTS.routechange, handleLocationChange);

  // Cleanup function
  return () => {
    window.removeEventListener("popstate", handleLocationChange);
    window.removeEventListener(WINDOW_EVENTS.navigation, handleLocationChange);
    window.removeEventListener(WINDOW_EVENTS.routechange, handleLocationChange);
  };
};

const getSnapshot = () => {
  return window.location.pathname;
};

/**
 * Custom hook that reactively tracks the current browser pathname using useSyncExternalStore.
 *
 * This hook solves the problem of navigation highlighting in the legacy SaaS context where:
 * - Navigation items need to highlight when active
 * - Users navigate via programmatic navigation (history.push) without page reloads
 * - window.location.pathname is not reactive and doesn't trigger React re-renders
 *
 * The hook subscribes to multiple navigation events:
 * - 'popstate': Browser back/forward navigation
 * - {@link WINDOW_EVENTS.navigation}: Custom events dispatched by NavigationLink / modals
 * - {@link WINDOW_EVENTS.routechange}: Potential React Router navigation events
 *
 * This ensures that components re-render whenever the URL changes, making navigation
 * highlighting work correctly in both standalone and bridged (legacy) contexts.
 *
 * @returns The current window.location.pathname that updates reactively
 */
export const useCurrentPathname = () => {
  return useSyncExternalStore(subscribe, getSnapshot);
};
