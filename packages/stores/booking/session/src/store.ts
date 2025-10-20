import { createStore } from "zustand/vanilla";

import { type PaginatedState, bindStore } from "@bsport/store-base";

import type { Session } from "#src/types";

export interface SessionState {
  sessions: PaginatedState<Session>;
}

export const sessionStore = createStore<SessionState>()(() => ({
  sessions: {
    byId: {},
    count: 0,
    ids: [],
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
