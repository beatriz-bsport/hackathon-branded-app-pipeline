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

export function startCancellingOption(optionId) {
  return { type: types.CONSUMER_CANCELLING_BOOKING_OPTION, optionId };
}
export function optionCancelled(optionId) {
  return { type: types.CONSUMER_BOOKING_OPTION_CANCELLED, optionId };
}
export function errorCancellingOption(optionId) {
  return { type: types.CONSUMER_ERROR_CANCELLING_BOOKING_OPTION, optionId };
}
export function cancelBookingOption(optionId) {
  return async (dispatch, getState) => {
    if (getState().consumer.optionCurrentlyCancelling !== null) {
      return;
    }
    dispatch(startCancellingOption());

    try {
      const response = await api.consumer.discardBookingOption(optionId);

      if (response.status === 200) {
        dispatch(optionCancelled(optionId));
        return;
      }
    } catch (err) {
      console.log(JSON.stringify(err));
    }
    dispatch(errorCancellingOption(optionId));
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

export function startFetchProfile() {
  return { type: types.CONSUMER_START_FETCH_PROFILE };
}
export function errorFetchingProfile() {
  return { type: types.CONSUMER_ERROR_FETCHING_PROFILE };
}
export function fetchedProfile(profile) {
  return {
    type: types.CONSUMER_HAS_FETCHED_PROFILE,
    profile,
  };
}
export function fetchProfile() {
  return async (dispatch) => {
    dispatch(startFetchProfile());

    const response = await api.consumer.fetchProfile();
    const profile = response.data;

    dispatch(fetchedProfile(profile));
  };
}
