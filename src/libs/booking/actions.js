import api from '../../api';

import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

export const actionTypes = {
  HAS_FETCHED_BOOKINGS: 'HAS_FETCHED_BOOKINGS',
  START_FETCH_BOOKINGS: 'START_FETCH_BOOKINGS',
  ERROR_FETCHING_BOOKINGS: 'ERROR_FETCHING_BOOKINGS',

  START_UPDATING_BOOKING_STATUS: 'START_UPDATING_BOOKING_STATUS',
  ERROR_UPDATING_BOOKING_STATUS: 'ERROR_UPDATING_BOOKING_STATUS',
  BOOKING_STATUS_UPDATED: 'BOOKING_STATUS_UPDATED',

  START_UPDATING_BOOKING_OPTION: 'START_UPDATING_BOOKING_OPTION',
  ERROR_UPDATING_BOOKING_OPTION: 'ERROR_UPDATING_BOOKING_OPTION',
  BOOKING_OPTION_CANCELLED: 'BOOKING_OPTION_CANCELLED',

  BOOKING_ADD_START: 'BOOKING_ADD_START',
  BOOKING_ADD_ERROR: 'BOOKING_ADD_ERROR',
  BOOKING_ADD_SUCCESS: 'BOOKING_ADD_SUCCESS',

  BOOKING_DELETE_START: 'BOOKING_DELETE_START',
  BOOKING_DELETE_SUCCESS: 'BOOKING_DELETE_SUCCESS',
  BOOKING_DELETE_ERROR: 'BOOKING_DELETE_ERROR',
};

export function updatingBookingOption(bookingOptionId) {
  return { type: actionTypes.START_UPDATING_BOOKING_OPTION, bookingOptionId };
}

export function errorUpdatingBookingOption(bookingOptionId) {
  return { type: actionTypes.ERROR_UPDATING_BOOKING_OPTION, bookingOptionId };
}

export function bookingOptionCancelled(bookingOptionId) {
  return { type: actionTypes.BOOKING_OPTION_CANCELLED, bookingOptionId };
}
export function discardBookingOption(bookingOptionId) {
  return async (dispatch) => {
    dispatch(updatingBookingOption(bookingOptionId));

    const response = await api.booking.discardBookingOption(bookingOptionId);
    if (response.status === 200) {
      return dispatch(bookingOptionCancelled(bookingOptionId));
    }
    return dispatch(errorUpdatingBookingOption(bookingOptionId));
  };
}

export function updatingBookingStatus(bookingId) {
  return { type: actionTypes.START_UPDATING_BOOKING_STATUS, bookingId };
}

export function errorUpdatingBookingStatus(bookingId) {
  return { type: actionTypes.ERROR_UPDATING_BOOKING_STATUS, bookingId };
}

export function bookingStatusUpdated(booking) {
  return { type: actionTypes.BOOKING_STATUS_UPDATED, booking };
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
      console.error(err);
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
  return { type: actionTypes.BOOKING_DELETE_START, bookingId };
}
export function deleteBookingSuccess(bookingId) {
  return { type: actionTypes.BOOKING_DELETE_SUCCESS, bookingId };
}
export function deleteBookingError(bookingId) {
  return { type: actionTypes.BOOKING_DELETE_ERROR, bookingId };
}
export function deleteBooking(bookingId, successCallback) {
  return async (dispatch) => {
    dispatch(deleteBookingStart(bookingId));

    try {
      const response = await api.booking.discard(bookingId);
      if (response.status === 204) {
        dispatch(deleteBookingSuccess(bookingId));
        dispatch(snackbarSuccess('form.booking.delete.success'));
        if (successCallback) {
          successCallback();
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

export function refreshByOffer(offerId) {
  return async (dispatch) => {
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

export function fetchBookingsByOffer(offerId) {
  return async (dispatch) => {
    dispatch(startFetchBookings());
    dispatch(refreshByOffer(offerId));
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
  return { type: actionTypes.HAS_FETCHED_BOOKINGS, bookings, booking_options };
}
export function startFetchBookings() {
  return { type: actionTypes.START_FETCH_BOOKINGS };
}
export function errorFetchingBookings() {
  return { type: actionTypes.ERROR_FETCHING_BOOKINGS };
}

export function addBooking({ offerId, consumerPaymentPackId, callback }) {
  return async (dispatch) => {
    dispatch(addBookingStart());

    try {
      const response = await api.booking.addToOffer({
        consumerPaymentPackId,
        offerId,
      });
      const booking = response.data;

      dispatch(addBookingSuccess(booking));
      if (callback) {
        callback();
      }
    } catch (err) {
      dispatch(addBookingError());
    }
  };
}

export function addBookingStart() {
  return { type: actionTypes.BOOKING_ADD_START };
}

export function addBookingError() {
  return { type: actionTypes.BOOKING_ADD_ERROR };
}

export function addBookingSuccess(booking) {
  return { type: actionTypes.BOOKING_ADD_SUCCESS, booking };
}
