import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { WebshopItem } from "#src/types";

export interface WebshopState {
  items: {
    byId: { [key: number]: WebshopItem };
    count: number;
    ids: number[];
    page: number;
  };
}

export const webshopStore = createStore<WebshopState>()(() => ({
  items: {
    byId: {},
    count: 0,
    ids: [],
    page: 1,
  },
}));

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const webshopItems = useWebshopStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const webshopItems = useWebshopStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const useWebshopStore = bindStore(webshopStore);
