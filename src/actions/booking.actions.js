import api from '../api';
import types from './booking.types';

import { snackbarSuccess, snackbarError } from './snackbar.actions';
import { quickFetch as quickFetchMember } from './member.actions';

export function updatingBookingOption(bookingOptionId) {
  return { type: types.START_UPDATING_BOOKING_OPTION, bookingOptionId };
}

export function errorUpdatingBookingOption(bookingOptionId) {
  return { type: types.ERROR_UPDATING_BOOKING_OPTION, bookingOptionId };
}

export function bookingOptionUpdated(bookingOption) {
  return { type: types.BOOKING_OPTION_UPDATED, bookingOption };
}
export function discardBookingOption(bookingOptionId) {
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

export function updatingBookingStatus(bookingId) {
  return { type: types.START_UPDATING_BOOKING_STATUS, bookingId };
}

export function errorUpdatingBookingStatus(bookingId) {
  return { type: types.ERROR_UPDATING_BOOKING_STATUS, bookingId };
}

export function bookingStatusUpdated(booking) {
  return { type: types.BOOKING_STATUS_UPDATED, booking };
}

function bookingUpdateWrapper(apiCall, bookingId) {
  return async (dispatch) => {
    dispatch(updatingBookingStatus(bookingId));

    try {
      const response = await apiCall(bookingId);
      if (response.status === 200) {
        const booking = response.data;
        return dispatch(bookingStatusUpdated(booking));
      }
    } catch (err) {
      console.log(err);
    }
    return dispatch(errorUpdatingBookingStatus(bookingId));
  };
}
export function confirmBookingAttendance(bookingId) {
  return bookingUpdateWrapper(api.booking.confirmAttendance, bookingId);
}
export function discardBookingAttendance(bookingId) {
  return bookingUpdateWrapper(api.booking.discardAttendance, bookingId);
}
export function confirmBooking(bookingId) {
  return bookingUpdateWrapper(api.booking.validate, bookingId);
}

export function deleteBookingStart(bookingId) {
  return { type: types.BOOKING_DELETE_START, bookingId };
}
export function deleteBookingSuccess(bookingId) {
  return { type: types.BOOKING_DELETE_SUCCESS, bookingId };
}
export function deleteBookingError(bookingId) {
  return { type: types.BOOKING_DELETE_ERROR, bookingId };
}
export function deleteBooking(bookingId, memberId) {
  return async (dispatch) => {
    dispatch(deleteBookingStart(bookingId));

    try {
      const response = await api.booking.discard(bookingId);
      if (response.status === 204) {
        dispatch(deleteBookingSuccess(bookingId));
        dispatch(snackbarSuccess('form.booking.delete.success'));
        if (memberId) {
          dispatch(quickFetchMember(memberId));
        }
      } else {
        dispatch(deleteBookingError(bookingId));
        dispatch(snackbarError('form.booking.delete.error'));
      }
    } catch (err) {
      dispatch(deleteBookingError(bookingId));
      dispatch(snackbarError('form.booking.delete.error'));
    }
  };
}

export function fetchBookingsByOffer(offerId, refreshOnly) {
  return async (dispatch) => {
    dispatch(startFetchBookings(refreshOnly));

    try {
      const response = await api.booking.fetchBookingsByOffer(offerId);
      const bookings = response.data;
      const response_ = await api.booking.fetchOptionsByOffer(offerId);
      const booking_options = response_.data;

      dispatch(fetchedBookings({ bookings, booking_options }));
    } catch (err) {
      dispatch(errorFetchingBookings());
    }
  };
}

export function fetchBookingsByMember(memberId) {
  return async (dispatch) => {
    dispatch(startFetchBookings());

    try {
      const response = await api.booking.fetchBookingsByMember(memberId);
      const bookings = response.data;
      const response_ = await api.booking.fetchOptionsByMember(memberId);
      const booking_options = response_.data;

      dispatch(fetchedBookings({ bookings, booking_options }));
    } catch (err) {
      dispatch(errorFetchingBookings());
    }
  };
}

export function fetchedBookings({ bookings, booking_options }) {
  return { type: types.HAS_FETCHED_BOOKINGS, bookings, booking_options };
}
export function startFetchBookings(refreshOnly) {
  return { type: types.START_FETCH_BOOKINGS, refreshOnly };
}
export function errorFetchingBookings() {
  return { type: types.ERROR_FETCHING_BOOKINGS };
}

export function addBooking({ offerId, consumerPaymentPackId, memberId }) {
  return async (dispatch) => {
    dispatch(addBookingStart());

    try {
      const response = await api.booking.addToOffer({
        consumerPaymentPackId,
        offerId,
      });
      const booking = response.data;

      dispatch(addBookingSuccess(booking));
      if (memberId) {
        dispatch(quickFetchMember(memberId));
      }
    } catch (err) {
      dispatch(addBookingError());
    }
  };
}

export function addBookingStart() {
  return { type: types.BOOKING_ADD_START };
}

export function addBookingError() {
  return { type: types.BOOKING_ADD_ERROR };
}

export function addBookingSuccess(booking) {
  return { type: types.BOOKING_ADD_SUCCESS, booking };
}
