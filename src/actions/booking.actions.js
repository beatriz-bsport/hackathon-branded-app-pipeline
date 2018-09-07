import api from '../api';
import types from './booking.types';

export function updatingBookingOption(bookingOptionId: number) {
  return { type: types.START_UPDATING_BOOKING_OPTION, bookingOptionId };
}

export function errorUpdatingBookingOption(bookingOptionId: number) {
  return { type: types.ERROR_UPDATING_BOOKING_OPTION, bookingOptionId };
}

export function bookingOptionUpdated(bookingOption: Object) {
  return { type: types.BOOKING_OPTION_UPDATED, bookingOption };
}
export function discardBookingOption(bookingOptionId: number) {
  return async (dispatch) => {
    dispatch(updatingBookingOption(bookingOptionId));

    const response = await api.booking.discardBookingOption(bookingOptionId);
    if (response.status === 200) {
      const bookingOption = response.data;
      return dispatch(bookingOptionUpdated(bookingOption));
    }
    return dispatch(errorUpdatingBookingOption(bookingOptionId));
  };
}

export function updatingBookingStatus(bookingId: number) {
  return { type: types.START_UPDATING_BOOKING_STATUS, bookingId };
}

export function errorUpdatingBookingStatus(bookingId: number) {
  return { type: types.ERROR_UPDATING_BOOKING_STATUS, bookingId };
}

export function bookingStatusUpdated(booking: Object) {
  return { type: types.BOOKING_STATUS_UPDATED, booking };
}

function bookingUpdateWrapper(
  apiCall: (bookingId: number) => Object,
  bookingId: number,
) {
  return async (dispatch) => {
    dispatch(updatingBookingStatus(bookingId));

    try {
      const response = await apiCall(bookingId);
      if (response.status === 200) {
        const booking = response.data;
        return dispatch(bookingStatusUpdated(booking));
      }
    } catch (err) {}
    return dispatch(errorUpdatingBookingStatus(bookingId));
  };
}
export function confirmBookingAttendance(bookingId: number) {
  return bookingUpdateWrapper(api.booking.confirmAttendance, bookingId);
}
export function discardBookingAttendance(bookingId: number) {
  return bookingUpdateWrapper(api.booking.discardAttendance, bookingId);
}
export function confirmBooking(bookingId: number) {
  return bookingUpdateWrapper(api.booking.validate, bookingId);
}
export function discardBooking(bookingId: number) {
  return bookingUpdateWrapper(api.booking.discard, bookingId);
}

export function fetchBookingsByOffer(offerId) {
  return async (dispatch) => {
    dispatch(startFetchBookings());

    try {
      const response = await api.booking.fetchBookingsByOffer(offerId);
      const bookings = response.data;

      dispatch(fetchedBookings(bookings));
    } catch (err) {
      dispatch(errorFetchingBookings());
    }
  };
}
export function fetchedBookings(bookings) {
  return { type: types.HAS_FETCHED_BOOKINGS, bookings };
}
export function startFetchBookings() {
  return { type: types.START_FETCH_BOOKINGS };
}
export function errorFetchingBookings() {
  return { type: types.ERROR_FETCHING_BOOKINGS };
}
