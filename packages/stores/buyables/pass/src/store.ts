import { createStore } from "zustand/vanilla";

import { type PaginatedState, bindStore } from "@bsport/store-base";

import type { Pass, PassCategory } from "#src/types";

export interface PassState {
  items: {
    byId: { [key: number]: Pass };
    active: Omit<PaginatedState<Pass>, "byId">;
    archived: Omit<PaginatedState<Pass>, "byId">;
    searched: Omit<PaginatedState<Pass>, "byId">;
  };
  categories: PaginatedState<PassCategory>;
}

export const passStore = createStore<PassState>()(() => ({
  items: {
    byId: {},
    active: {
      count: 0,
      page: 1,
      ids: [],
    },
    archived: {
      count: 0,
      page: 1,
      ids: [],
    },
    searched: {
      count: 0,
      page: 1,
      ids: [],
    },
  },
  categories: {
    byId: {},
    count: 0,
    page: 1,
    ids: [],
  },
}));

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const passs = usePassStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const passs = usePassStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const usePassStore = bindStore(passStore);
