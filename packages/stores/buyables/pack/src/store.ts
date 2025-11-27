import { createStore } from "zustand/vanilla";

import {
  DEFAULT_PAGE,
  type PaginatedState,
  bindStore,
} from "@bsport/store-base";

import type { Pack, PurchasedPack } from "#src/types";

export type PackState = PaginatedState<Pack> & {
  fuzzyIds: Array<number>;
  purchasedPacks: PaginatedState<PurchasedPack>;
};

export const packStore = createStore<PackState>()(() => ({
  byId: {},
  count: 0,
  ids: [],
  fuzzyIds: [],
  page: DEFAULT_PAGE,
  purchasedPacks: {
    byId: {},
    count: 0,
    ids: [],
    page: DEFAULT_PAGE,
  },
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
