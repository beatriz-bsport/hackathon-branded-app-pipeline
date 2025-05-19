import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Pack } from "#src/types";

export interface PackState {
  byId: { [key: number]: Pack };
  count: number;
  ids: number[];
  page: number;
}

export const packStore = createStore<PackState>()(() => ({
  byId: {},
  count: 0,
  ids: [],
  page: 1,
}));

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const packs = usePackStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const packs = usePackStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const usePackStore = bindStore(packStore);
