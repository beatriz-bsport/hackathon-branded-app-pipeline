import { createStore } from "zustand/vanilla";

import { type PaginatedState, bindStore } from "@bsport/store-base";

import type { ManagerSession } from "#src/types";

export interface SessionState {
  managerSessions: PaginatedState<ManagerSession>;
}

export const sessionStore = createStore<SessionState>()(() => ({
  managerSessions: {
    byId: {},
    ids: [],
    count: 0,
    page: 1,
  },
}));

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const sessions = useSessionStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const sessions = useSessionStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const useSessionStore = bindStore(sessionStore);
