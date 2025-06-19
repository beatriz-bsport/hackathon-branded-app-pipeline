import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { UserAccess } from "#src/types";

export interface AuthState {
  userAccess: UserAccess | undefined;
  temporaryPassword:
    | {
        password: string;
        expirationDate: string;
      }
    | undefined;
}

export const authStore = createStore<AuthState>()(() => ({
  userAccess: undefined,
  temporaryPassword: undefined,
}));

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const userAccess = useAuthStore(selectUserAccess);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const userAccess = useAuthStore(selectUserAccess, (a, b) => a.id === b.id);
 *   ```
 */
export const useAuthStore = bindStore(authStore);
