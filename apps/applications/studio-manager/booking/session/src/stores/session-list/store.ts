import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";
import type { ManagerSession } from "@bsport/store-booking-session";

export type EnrichedSession = ManagerSession & {
  teacherName?: string;
  originalTeacherName?: string;
  establishmentName?: string;
};

type SessionsState = {
  byId: {
    [key: number]: EnrichedSession;
  };
  ids: number[];
  byDate: {
    [key: string]: number[]; // array of session IDs
  };
};

export type DateSelection =
  | { type: "single"; date: Date }
  | { type: "range"; minDate: Date; maxDate: Date };

export interface SessionListState {
  sessions: SessionsState;
  calendarView: "daily" | "range";
  selectedDate: DateSelection;
}

export const getInitialState = (): SessionListState => ({
  sessions: {
    byId: {},
    ids: [],
    byDate: {},
  },
  calendarView: "daily",
  selectedDate: { type: "single", date: new Date() },
});

export const sessionListStore = createStore<SessionListState>(getInitialState);

/**
 * @description
 * Hook to access the session creation form state.
 * You can:
 * - Retrieve the entire state:
 *   ```tsx
 *   const state = useSessionListStore();
 *   ```
 * - Retrieve a specific item from the store by providing a selector:
 *   ```tsx
 *   const currentStep = useSessionListStore((state) => state.currentStep);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization:
 *   ```tsx
 *   const step = useSessionListStore(selector, (a, b) => a === b);
 *   ```
 */
export const useSessionListStore = bindStore(sessionListStore);
