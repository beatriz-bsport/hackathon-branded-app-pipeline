import { devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

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
  },
  waitlistFilters: WaitlistFilter.ON_WAITLIST,
  selectedBookingId: null,
});

export const sessionManagementStore = createStore<SessionManagementState>()(
  devtools(
    persist(getInitialState, {
      name: "session-management-storage",
      partialize: (state) => ({
        bookingFilters: state.bookingFilters,
        waitlistFilters: state.waitlistFilters,
      }),
    }),
  ),
);

export const useSessionManagementStore = bindStore(sessionManagementStore);
