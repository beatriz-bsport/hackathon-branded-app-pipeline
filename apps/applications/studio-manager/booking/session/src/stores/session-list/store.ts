import { createStore } from "zustand/vanilla";

import { DateTime, getLocalNow } from "@bsport/datetime-manipulation";
import { FilterElementState } from "@bsport/kaizen-primitive-core";
import { bindStore } from "@bsport/store-base";

export enum CalendarView {
  DAILY = "daily",
  RANGE = "range",
}

export type DateSelection =
  | { type: "single"; date: DateTime }
  | { type: "range"; minDate: DateTime | null; maxDate: DateTime | null };

export interface SessionListState {
  calendarView: CalendarView;
  selectedDate: DateSelection;
  locale: string;
  showCancelledSessions: boolean;
  filters: FilterElementState[];
}

export const getInitialState = (): SessionListState => ({
  calendarView: CalendarView.DAILY,
  selectedDate: { type: "single", date: getLocalNow({}) },
  showCancelledSessions: true,
  locale: "en-US",
  filters: [],
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
