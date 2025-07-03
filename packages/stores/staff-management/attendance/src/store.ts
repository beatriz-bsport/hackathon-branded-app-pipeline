import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Attendance } from "#src/types";

export interface AttendanceState {
  byId: { [key: number]: Attendance };
  count: number;
  ids: number[];
  page: number;
}

export const attendanceStore = createStore<AttendanceState>()(() => ({
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
 *   const attendances = useAttendanceStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const attendances = useAttendanceStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const useAttendanceStore = bindStore(attendanceStore);
