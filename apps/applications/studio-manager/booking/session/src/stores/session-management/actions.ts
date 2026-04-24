import { sessionManagementStore } from "./store";
import type {
  BookingAttendanceFilter,
  BookingSourceFilter,
  BookingStatusFilter,
  WaitlistFilter,
} from "./types";

export const setBookingStatusFilter = (value: BookingStatusFilter) => {
  sessionManagementStore.setState((state) => ({
    bookingFilters: {
      ...state.bookingFilters,
      status: value,
    },
  }));
};

export const setBookingAttendanceFilter = (value: BookingAttendanceFilter) => {
  sessionManagementStore.setState((state) => ({
    bookingFilters: {
      ...state.bookingFilters,
      attendance: state.bookingFilters.attendance === value ? null : value,
    },
  }));
};

export const setBookingSourceFilter = (value: BookingSourceFilter) => {
  sessionManagementStore.setState((state) => {
    const isToggleOff = state.bookingFilters.source === value;
    return {
      bookingFilters: {
        ...state.bookingFilters,
        source: isToggleOff ? null : value,
        aggregatorIds:
          isToggleOff || value !== "aggregator"
            ? []
            : state.bookingFilters.aggregatorIds,
      },
    };
  });
};

export const setBookingAggregatorIds = (ids: number[]) => {
  sessionManagementStore.setState((state) => ({
    bookingFilters: {
      ...state.bookingFilters,
      aggregatorIds: ids,
    },
  }));
};

export const setWaitlistFilter = (filter: WaitlistFilter) => {
  sessionManagementStore.setState(() => ({
    waitlistFilters: filter,
  }));
};

export const setSelectedBooking = (bookingId: number | null) => {
  sessionManagementStore.setState(() => ({
    selectedBookingId: bookingId,
  }));
};
