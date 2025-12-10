import { createStore } from "zustand/vanilla";

import type { MetaActivity } from "@bsport/api-book";
import { PaginatedState, bindStore } from "@bsport/store-base";

/** @indication Example of a paginated state */

export interface GroupActivityState {
  groupActivity: PaginatedState<MetaActivity> & {
    searchedIds: number[];
    interrogate: {
      canDestroy: boolean;
      offers: number[];
    };
  };
}

export const groupActivityStore = createStore<GroupActivityState>()(() => ({
  groupActivity: {
    byId: {},
    count: 0,
    ids: [],
    searchedIds: [],
    page: 1,
    interrogate: {
      canDestroy: true,
      offers: [],
    },
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
