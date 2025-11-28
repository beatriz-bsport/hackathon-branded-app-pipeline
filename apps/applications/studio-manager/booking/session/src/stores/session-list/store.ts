import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import { InternalEnrichedSession } from "./types";

type SessionsState = {
  byId: {
    [key: number]: InternalEnrichedSession;
  };
  ids: number[];
  byDate: {
    [key: string]: number[]; // array of session IDs
  };
};

export enum CalendarView {
  DAILY = "daily",
  RANGE = "range",
}

export type DateSelection =
  | { type: "single"; date: Date }
  | { type: "range"; minDate: Date; maxDate: Date };

export interface SessionListState {
  sessions: SessionsState;
  calendarView: CalendarView;
  selectedDate: DateSelection;
}

export const getInitialState = (): SessionListState => ({
  sessions: {
    byId: {},
    ids: [],
    byDate: {},
  },
  calendarView: CalendarView.DAILY,
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
