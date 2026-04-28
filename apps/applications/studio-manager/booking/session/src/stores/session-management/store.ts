import { devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import { DEFAULT_SESSION_LISTED_INFORMATION } from "#src/constants";

import {
  BookingStatusFilter,
  type SessionManagementState,
  WaitlistFilter,
} from "./types";

export const getInitialState = (): SessionManagementState => ({
  bookingFilters: {
    status: BookingStatusFilter.BOOKED,
    attendance: null,
    source: null,
    aggregatorIds: [],
    ordering: undefined,
  },
  waitlistFilters: WaitlistFilter.ON_WAITLIST,
  selectedBookingId: null,
  listedInformation: DEFAULT_SESSION_LISTED_INFORMATION,
});

export const sessionManagementStore = createStore<SessionManagementState>()(
  devtools(
    persist(getInitialState, {
      name: "session-management-storage",
      partialize: (state) => ({
        bookingFilters: state.bookingFilters,
        waitlistFilters: state.waitlistFilters,
        listedInformation: state.listedInformation,
      }),
    }),
  ),
);

export const useSessionManagementStore = bindStore(sessionManagementStore);
