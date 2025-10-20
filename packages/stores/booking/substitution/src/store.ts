import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { SubstitutionRequest } from "#src/types";

export interface SubstitutionState {
  requests: {
    byId: { [key: number]: SubstitutionRequest };
    ids: number[];
  };
}

export const substitutionStore = createStore<SubstitutionState>()(() => ({
  requests: {
    byId: {},
    ids: [],
  },
}));

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const substitutionRequests = useSubstitutionStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const substitutionRequests = useSubstitutionStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const useSubstitutionStore = bindStore(substitutionStore);
