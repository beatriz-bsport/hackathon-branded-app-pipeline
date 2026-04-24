import { sessionManagementStore } from "./store";
import type {
  BookingAttendanceFilter,
  BookingListedInformation,
  BookingOrdering,
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

export const setBookingOrdering = (ordering: BookingOrdering) => {
  sessionManagementStore.setState((state) => ({
    bookingFilters: {
      ...state.bookingFilters,
      ordering: ordering ?? undefined,
    },
  }));
};

export const setListedInformation = (
  listedInformation: BookingListedInformation,
) => {
  sessionManagementStore.setState((state) => {
    const isCurrentlyListed =
      state.listedInformation.includes(listedInformation);
    const newListedInformation = isCurrentlyListed
      ? state.listedInformation.filter((info) => info !== listedInformation)
      : [...state.listedInformation, listedInformation];
    return {
      listedInformation: newListedInformation,
    };
  });
};
