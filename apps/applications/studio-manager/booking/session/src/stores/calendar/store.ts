import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";
import { FilterElementState } from "@bsport/kaizen-primitive-core";
import { bindStore } from "@bsport/store-base";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import {
  DEFAULT_APPOINTMENT_COLUMNS,
  DEFAULT_SESSION_COLUMNS,
} from "#src/constants";
import {
  AppointmentColumn,
  CalendarView,
  DateSelection,
  ModalState,
  SessionColumns,
} from "#src/types";

export interface SessionTabState {
  showCancelled: boolean;
  filters: FilterElementState[];
  displayedColumns: SessionColumns[];
}

export interface AppointmentTabState {
  showCancelled: boolean;
  filters: FilterElementState[];
  displayedColumns: AppointmentColumn[];
}

export interface CalendarState {
  calendarView: CalendarView;
  selectedDate: DateSelection;
  locale: string;
  modalState: ModalState;
  sessions: SessionTabState;
  appointments: AppointmentTabState;
}

export const getInitialState = (): CalendarState => {
  const timezone = getCompanyTimezone();
  return {
    calendarView: CalendarView.DAILY,
    selectedDate: { type: "single", date: getLocalNow({ zone: timezone }) },
    locale: "en-US",
    modalState: null,
    sessions: {
      showCancelled: true,
      filters: [],
      displayedColumns: DEFAULT_SESSION_COLUMNS,
    },
    appointments: {
      showCancelled: true,
      filters: [],
      displayedColumns: DEFAULT_APPOINTMENT_COLUMNS,
    },
  };
};

// Custom storage that handles DateTime serialization
const customStorage = createJSONStorage(() => localStorage, {
  reviver: (key: string, value: unknown) => {
    if (value && ["date", "minDate", "maxDate"].includes(key)) {
      return fromIsoString(value as string);
    }
    return value;
  },
});

// Changed persist key from "session-list-storage" to "calendar-storage"
// to clear localStorage for trial users (no migration needed, ~10 companies)
export const calendarStore = createStore<CalendarState>()(
  devtools(
    persist(getInitialState, {
      name: "calendar-storage",
      storage: customStorage,
    }),
  ),
);

/**
 * @description
 * Hook to access the calendar store state.
 * You can:
 * - Retrieve the entire state:
 *   ```tsx
 *   const state = useCalendarStore();
 *   ```
 * - Retrieve a specific item from the store by providing a selector:
 *   ```tsx
 *   const view = useCalendarStore((state) => state.calendarView);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization:
 *   ```tsx
 *   const step = useCalendarStore(selector, (a, b) => a === b);
 *   ```
 */
export const useCalendarStore = bindStore(calendarStore);
