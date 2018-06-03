//@flow

import api from '../api';
import types from './booking.types';

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
