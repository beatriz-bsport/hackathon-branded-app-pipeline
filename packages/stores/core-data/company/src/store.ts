import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Company, UpsellSumup } from "#src/types";

export interface CompanyState {
  byId: { [key: number]: Company };
  searchIds: number[];
  features: UpsellSumup[];
}

export const companyStore = createStore<CompanyState>()(() => ({
  byId: {},
  searchIds: [],
  features: [],
}));

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const features = useCompanyStore(selectFeatures);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const features = useCompanyStore(selectFeatures, (a, b) => a.id === b.id);
 *   ```
 */
export const useCompanyStore = bindStore(companyStore);
