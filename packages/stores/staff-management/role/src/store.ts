import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Role } from "#src/types";

export interface RoleState {
  byId: { [key: number]: Role };
  count: number;
  ids: number[];
  page: number;
}

export const roleStore = createStore<RoleState>()(() => ({
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
 *   const roles = useRoleStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const roles = useRoleStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const useRoleStore = bindStore(roleStore);
