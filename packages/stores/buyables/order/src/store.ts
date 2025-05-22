import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Order } from "#src/types";

export interface OrderState {
  byId: { [key: string]: Order };
  count: number;
  ids: string[];
  page: number;
}

export const orderStore = createStore<OrderState>()(() => ({
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
 *   const orders = useOrderStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const orders = useOrderStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const useOrderStore = bindStore(orderStore);
