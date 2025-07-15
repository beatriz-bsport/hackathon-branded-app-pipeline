import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Member } from "#src/types";

export interface MemberState {
  byId: { [key: number]: Member };
  count: number;
  ids: number[];
  page: number;
  irregularities: number[];
  search: {
    active: Array<Member>;
    archived: Array<Member>;
  };
}

export const memberStore = createStore<MemberState>()(() => ({
  byId: {},
  count: 0,
  ids: [],
  page: 1,
  irregularities: [],
  search: {
    active: [],
    archived: [],
  },
}));

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const members = useMemberStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const members = useMemberStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const useMemberStore = bindStore(memberStore);
