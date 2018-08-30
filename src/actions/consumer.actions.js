// @flow

import api from '../api';
import types from './consumer.types';

export function startFetchBookings() {
  return { type: types.CONSUMER_START_FETCH_BOOKINGS };
}
export function errorFetchingBookings() {
  return { type: types.CONSUMER_ERROR_FETCHING_BOOKINGS };
}
export function fetchedBookings({ futureBookings, pastBookings }) {
  return {
    type: types.CONSUMER_HAS_FETCHED_BOOKINGS,
    futureBookings,
    pastBookings,
  };
}
export function fetchBookings() {
  return async (dispatch) => {
    dispatch(startFetchBookings());

    const response = await api.consumer.fetchFutureBookings();
    const futureBookings = response.data.results;

    const response_ = await api.consumer.fetchPastBookings();
    const pastBookings = response_.data.results;

    dispatch(fetchedBookings({ futureBookings, pastBookings }));
  };
}

export function startFetchOptions() {
  return { type: types.CONSUMER_START_FETCH_OPTIONS };
}
export function errorFetchingOptions() {
  return { type: types.CONSUMER_ERROR_FETCHING_OPTIONS };
}
export function fetchedOptions(bookingOptions) {
  return { type: types.CONSUMER_HAS_FETCHED_OPTIONS, bookingOptions };
}
export function fetchOptions() {
  return async (dispatch) => {
    dispatch(startFetchOptions());

    try {
      const response = await api.consumer.fetchOptions();
      const bookingOptions = response.data;

      dispatch(fetchedOptions(bookingOptions));
    } catch (err) {
      dispatch(errorFetchingOptions());
    }
  };
}

export function startFetchConsumerPaymentPacks() {
  return { type: types.CONSUMER_START_FETCH_PAYMENT_PACKS };
}
export function errorFetchingConsumerPaymentPacks() {
  return { type: types.CONSUMER_ERROR_FETCHING_PAYMENT_PACKS };
}
export function fetchedConsumerPaymentPacks(consumerPaymentPacks) {
  return {
    type: types.CONSUMER_HAS_FETCHED_PAYMENT_PACKS,
    consumerPaymentPacks,
  };
}
export function fetchConsumerPaymentPacks() {
  return async (dispatch) => {
    dispatch(startFetchConsumerPaymentPacks());

    const response = await api.consumer.fetchConsumerPaymentPacks();
    const consumerPaymentPacks = response.data.results;

    dispatch(fetchedConsumerPaymentPacks(consumerPaymentPacks));
  };
}
