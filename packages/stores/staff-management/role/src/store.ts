import { createStore } from "zustand/vanilla";

import { type PaginatedState, bindStore } from "@bsport/store-base";

import type { CompanyRole, Staff } from "#src/types";

export interface RoleState {
  companyRoles: PaginatedState<CompanyRole>;
  staff: PaginatedState<Staff>;
}

const createDefaultPaginatedState = () => ({
  byId: {},
  count: 0,
  ids: [],
  page: 1,
});

export const roleStore = createStore<RoleState>()(() => ({
  companyRoles: createDefaultPaginatedState(),
  staff: createDefaultPaginatedState(),
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
