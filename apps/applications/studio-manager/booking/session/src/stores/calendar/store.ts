import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";
import { FilterElementState } from "@bsport/kaizen-primitive-core";
import { bindStore } from "@bsport/store-base";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import {
  DEFAULT_APPOINTMENT_COLUMNS,
  DEFAULT_SERIES_COLUMNS,
  DEFAULT_SESSION_COLUMNS,
} from "#src/constants";
import {
  AppointmentColumn,
  CalendarView,
  DateSelection,
  ModalState,
  SeriesColumn,
  SeriesOrdering,
  SessionColumns,
} from "#src/types";

import { migrateLegacyRangeView } from "./selection";

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

export interface SeriesTabState {
  filters: FilterElementState[];
  showCancelled: boolean;
  displayedColumns: SeriesColumn[];
  ordering: SeriesOrdering;
}

export interface CalendarState {
  calendarView: CalendarView;
  selectedDate: DateSelection;
  locale: string;
  modalState: ModalState;
  classes: SessionTabState;
  appointments: AppointmentTabState;
  series: SeriesTabState;
}

export const getInitialState = (): CalendarState => {
  const timezone = getCompanyTimezone();
  return {
    calendarView: CalendarView.DAILY,
    selectedDate: { type: "single", date: getLocalNow({ zone: timezone }) },
    locale: "en-US",
    modalState: null,
    classes: {
      showCancelled: true,
      filters: [],
      displayedColumns: DEFAULT_SESSION_COLUMNS,
    },
    appointments: {
      showCancelled: true,
      filters: [],
      displayedColumns: DEFAULT_APPOINTMENT_COLUMNS,
    },
    series: {
      filters: [],
      showCancelled: true,
      displayedColumns: DEFAULT_SERIES_COLUMNS,
      ordering: "upcoming",
    },
  };
};

// Custom storage that handles DateTime serialization
const customStorage = createJSONStorage(() => localStorage, {
  reviver: (key: string, value: unknown) => {
    if (value && ["date", "minDate", "maxDate", "anchor"].includes(key)) {
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
      version: 1,
      migrate: (persistedState) =>
        migrateLegacyRangeView(persistedState as CalendarState),
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
