// @flow
import api from '../../api';

import { fetchFilteredBookingOptions as fetchFilteredBookingOptionsAPI } from './api';
import type { Dispatch } from '../../state/types';

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

  BOOKING_OPTION_REGISTER_SUCCESS: 'BOOKING_OPTION_REGISTER_SUCCESS',

  BOOKING_ADD_START: 'BOOKING_ADD_START',
  BOOKING_ADD_ERROR: 'BOOKING_ADD_ERROR',
  BOOKING_ADD_SUCCESS: 'BOOKING_ADD_SUCCESS',

  BOOKING_DELETE_START: 'BOOKING_DELETE_START',
  BOOKING_DELETE_SUCCESS: 'BOOKING_DELETE_SUCCESS',
  BOOKING_DELETE_ERROR: 'BOOKING_DELETE_ERROR',
};

export function updatingBookingOption(bookingOptionId: number) {
  return { type: actionTypes.START_UPDATING_BOOKING_OPTION, bookingOptionId };
}

export function errorUpdatingBookingOption(bookingOptionId: number) {
  return { type: actionTypes.ERROR_UPDATING_BOOKING_OPTION, bookingOptionId };
}

export function bookingOptionCancelled(bookingOptionId: number) {
  return { type: actionTypes.BOOKING_OPTION_CANCELLED, bookingOptionId };
}

export function discardBookingOption(bookingOptionId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(updatingBookingOption(bookingOptionId));

    try {
      await api.booking.discardBookingOption(bookingOptionId);

      dispatch(bookingOptionCancelled(bookingOptionId));
    } catch (err) {
      console.error(err);
      dispatch(errorUpdatingBookingOption(bookingOptionId));
    }
  };
}

export function bookingOptionRegistered(bookingOption: BookingOption) {
  return { type: actionTypes.BOOKING_OPTION_REGISTER_SUCCESS, bookingOption };
}

export function registerToWaitingList(
  offerId: number,
  memberId: number,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.booking.registerToWaitingList(
        offerId,
        memberId,
      );
      dispatch(bookingOptionRegistered(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      if (options && options.onError) options.onError();
    }
  };
}

export function updatingBookingStatus(bookingId: number) {
  return { type: actionTypes.START_UPDATING_BOOKING_STATUS, bookingId };
}

export function errorUpdatingBookingStatus(bookingId: number) {
  return { type: actionTypes.ERROR_UPDATING_BOOKING_STATUS, bookingId };
}

export function bookingStatusUpdated(booking: Booking) {
  return { type: actionTypes.BOOKING_STATUS_UPDATED, booking };
}

function bookingUpdateWrapper(apiCall, bookingId) {
  return async (dispatch: Dispatch) => {
    dispatch(updatingBookingStatus(bookingId));

    try {
      const response = await apiCall(bookingId);
      const booking = response.data;
      dispatch(bookingStatusUpdated(booking));
    } catch (err) {
      console.error(err);
      dispatch(errorUpdatingBookingStatus(bookingId));
    }
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

export function deleteBookingStart(bookingId: number) {
  return { type: actionTypes.BOOKING_DELETE_START, bookingId };
}
export function deleteBookingSuccess(bookingId: number) {
  return { type: actionTypes.BOOKING_DELETE_SUCCESS, bookingId };
}
export function deleteBookingError(bookingId: number) {
  return { type: actionTypes.BOOKING_DELETE_ERROR, bookingId };
}
export function deleteBooking(bookingId: number, successCallback: ?() => void) {
  return async (dispatch) => {
    dispatch(deleteBookingStart(bookingId));

    try {
      await api.booking.discard(bookingId);
      dispatch(deleteBookingSuccess(bookingId));
      dispatch(snackbarSuccess('form.booking.delete.success'));
      if (successCallback) {
        successCallback();
      }
    } catch (err) {
      dispatch(deleteBookingError(bookingId));
      dispatch(snackbarError('form.booking.delete.error'));
    }
  };
}

export function refreshByOffer(offerId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(errorFetchingBookings(null));
    try {
      const response = await api.booking.fetchBookingsByOffer(offerId);
      const bookings = response.data;
      const response_ = await fetchFilteredBookingOptionsAPI({
        offer: offerId,
        as_manager: true,
      });
      const booking_options = response_.data;

      dispatch(fetchedBookings({ bookings, booking_options }));
    } catch (err) {
      dispatch(errorFetchingBookings(err));
    }
  };
}

export function fetchBookingsByOffer(offerId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchBookings());
    dispatch(refreshByOffer(offerId));
  };
}

export function fetchBookingsByMember(memberId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchBookings());

    try {
      const response = await api.booking.fetchBookingsByMember(memberId);
      const bookings = response.data;
      const response_ = await api.booking.fetchOptionsByMember(memberId);
      const booking_options = response_.data;

      dispatch(fetchedBookings({ bookings, booking_options }));
    } catch (err) {
      dispatch(errorFetchingBookings(err));
    }
  };
}

export function fetchedBookings({
  bookings,
  booking_options,
}: {
  bookings: Array<Booking>,
  booking_options: Array<BookingOption>,
}) {
  return { type: actionTypes.HAS_FETCHED_BOOKINGS, bookings, booking_options };
}
export function startFetchBookings() {
  return { type: actionTypes.START_FETCH_BOOKINGS };
}
export function errorFetchingBookings(error: ?Error) {
  return { type: actionTypes.ERROR_FETCHING_BOOKINGS, error };
}

export function addBooking({
  offerId,
  consumerPaymentPackId,
  callback,
  onError,
}: {
  offerId: number,
  consumerPaymentPackId: number,
  callback: ?() => void,
  onError: ?() => void,
}) {
  return async (dispatch: Dispatch) => {
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
      console.error(err);
      dispatch(addBookingError(err));
      if (typeof onError === 'function') onError();
    }
  };
}

export function addBookingStart() {
  return { type: actionTypes.BOOKING_ADD_START };
}

export function addBookingError(error: ?Error) {
  return { type: actionTypes.BOOKING_ADD_ERROR, error };
}

export function addBookingSuccess(booking: Booking) {
  return { type: actionTypes.BOOKING_ADD_SUCCESS, booking };
}
