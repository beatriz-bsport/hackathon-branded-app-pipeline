import { createStore } from "zustand/vanilla";

import type { Teacher } from "@bsport/api-core";
import { type PaginatedState, bindStore } from "@bsport/store-base";

export type TeacherState = {
  flatIds: number[];
  fuzzyIds: number[];
} & PaginatedState<Teacher>;

export const teacherStore = createStore<TeacherState>()(() => ({
  byId: {},
  count: 0,
  ids: [],
  page: 1,
  flatIds: [],
  fuzzyIds: [],
}));

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const teachers = useTeacherStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const teachers = useTeacherStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const useTeacherStore = bindStore(teacherStore);
