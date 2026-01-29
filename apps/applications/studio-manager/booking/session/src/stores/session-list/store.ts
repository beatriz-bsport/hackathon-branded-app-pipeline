import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import {
  type DateTime,
  fromIsoString,
  getLocalNow,
} from "@bsport/datetime-manipulation";
import { FilterElementState } from "@bsport/kaizen-primitive-core";
import { bindStore } from "@bsport/store-base";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { DEFAULT_COLUMNS } from "#src/constants";
import type { Columns, EnrichedSession } from "#src/types";

export enum CalendarView {
  DAILY = "daily",
  RANGE = "range",
}

export type DateSelection =
  | { type: "single"; date: DateTime }
  | { type: "range"; minDate: DateTime | null; maxDate: DateTime | null };

export enum ModalType {
  CANCEL = "cancel",
  RESTORE = "restore",
  DELETE = "delete",
  DUPLICATE = "duplicate",
}

export type ModalState = { type: ModalType; session: EnrichedSession } | null;

export interface SessionListState {
  calendarView: CalendarView;
  selectedDate: DateSelection;
  locale: string;
  showCancelledSessions: boolean;
  filters: FilterElementState[];
  modalState: ModalState;
  displayedColumns: Columns[];
}

export const getInitialState = (): SessionListState => {
  const timezone = getCompanyTimezone();
  return {
    calendarView: CalendarView.DAILY,
    selectedDate: { type: "single", date: getLocalNow({ zone: timezone }) },
    showCancelledSessions: true,
    locale: "en-US",
    filters: [],
    modalState: null,
    displayedColumns: DEFAULT_COLUMNS,
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

export const sessionListStore = createStore<SessionListState>()(
  devtools(
    persist(getInitialState, {
      name: "session-list-storage",
      storage: customStorage,
    }),
  ),
);

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
