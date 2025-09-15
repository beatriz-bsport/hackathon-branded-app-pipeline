import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Pass } from "#src/types";

export interface PassState {
  byId: { [key: number]: Pass };
  count: number;
  ids: number[];
  page: number;
}

export const passStore = createStore<PassState>()(() => ({
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
 *   const passs = usePassStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const passs = usePassStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const usePassStore = bindStore(passStore);
