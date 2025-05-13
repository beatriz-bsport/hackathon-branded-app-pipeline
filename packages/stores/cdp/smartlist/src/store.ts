import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Smartlist } from "#src/types";

export interface SmartlistState {
  byId: { [key: number]: Smartlist };
  count: number;
  ids: number[];
  page: number;
}

export const smartlistStore = createStore<SmartlistState>()(() => ({
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
 *   const smartlists = useSmartlistStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const smartlists = useSmartlistStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const useSmartlistStore = bindStore(smartlistStore);
