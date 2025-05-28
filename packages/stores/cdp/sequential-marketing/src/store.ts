import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";
import type { PaginatedState } from "@bsport/store-base";

import type { Cadence } from "#src/types";

export type SequentialMarketingState = PaginatedState<Cadence>;

export const sequentialMarketingStore = createStore<SequentialMarketingState>()(
  () => ({
    byId: {},
    count: 0,
    ids: [],
    page: 1,
  }),
);

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const cadences = useSequentialMarketingStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const cadences = useSequentialMarketingStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const useSequentialMarketingStore = bindStore(sequentialMarketingStore);
