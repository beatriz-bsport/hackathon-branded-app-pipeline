import { useSyncExternalStore } from "react";

import { WINDOW_EVENTS } from "#src/constants/window-events";

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener(WINDOW_EVENTS.navigation, onStoreChange);
  window.addEventListener(WINDOW_EVENTS.routechange, onStoreChange);

  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener(WINDOW_EVENTS.navigation, onStoreChange);
    window.removeEventListener(WINDOW_EVENTS.routechange, onStoreChange);
  };
};

const getSnapshot = () => {
  return typeof window !== "undefined" ? window.location.search : "";
};

/**
 * Reactively tracks `window.location.search`, including updates made via
 * `history.replaceState` and the custom `navigation` event.
 */
export const useCurrentSearch = () => {
  return useSyncExternalStore(subscribe, getSnapshot, () => "");
};
