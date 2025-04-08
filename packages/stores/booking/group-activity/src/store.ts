import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { MetaActivity } from "#src/types";

/** @indication Example of a paginated state */

export interface GroupActivityState {
  byId: { [key: number]: MetaActivity };
  count: number;
  ids: number[];
  page: number;
  interrogate: {
    canDestroy: boolean;
    offers: number[];
  };
}

export const groupActivityStore = createStore<GroupActivityState>()(() => ({
  byId: {},
  count: 0,
  ids: [],
  page: 1,
  interrogate: {
    canDestroy: true,
    offers: [],
  },
}));

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const groupActivities = useGroupActivityStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const groupActivities = useGroupActivityStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const useGroupActivityStore = bindStore(groupActivityStore);
