import { createStore } from "zustand/vanilla";

import { type PaginatedState, bindStore } from "@bsport/store-base";

import type { WebshopCategory, WebshopItem } from "#src/types";

export interface WebshopState {
  items: {
    byId: { [key: number]: WebshopItem };
    active: Omit<PaginatedState<WebshopItem>, "byId">;
    searched: Omit<PaginatedState<WebshopItem>, "byId">;
  };
  categories: PaginatedState<WebshopCategory>;
}

export const webshopStore = createStore<WebshopState>()(() => ({
  items: {
    byId: {},
    active: {
      count: 0,
      ids: [],
      page: 1,
    },
    searched: {
      count: 0,
      ids: [],
      page: 1,
    },
  },
  categories: {
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
