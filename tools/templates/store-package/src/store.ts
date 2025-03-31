import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Model } from "#src/types";

/** @indication Example of a paginated state */

export interface ModelState {
  byId: { [key: number]: Model };
  count: number;
  ids: number[];
  page: number;
}

export const modelStore = createStore<ModelState>()(() => ({
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
 *   const models = useModelStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const models = useModelStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const useModelStore = bindStore(modelStore);
