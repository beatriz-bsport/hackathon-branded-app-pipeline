// @flow

import api from '../api';
import types from './consumer.types';
import type { State, Dispatch, OptionCallback } from '../state/types';

export function startFetchBookings() {
  return { type: types.CONSUMER_START_FETCH_BOOKINGS };
}
export function errorFetchingBookings() {
  return { type: types.CONSUMER_ERROR_FETCHING_BOOKINGS };
}
export function fetchBookingError(error: ?Error) {
  return { type: types.CONSUMER_FETCH_BOOKING_ERROR, error };
}
export function fetchedBookings({
  futureBookings,
  pastBookings,
}: {
  futureBookings: Array<Booking>,
  pastBookings: Array<Booking>,
}) {
  return {
    type: types.CONSUMER_HAS_FETCHED_BOOKINGS,
    futureBookings,
    pastBookings,
  };
}
export function fetchBookings() {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchBookings());
    dispatch(fetchBookingError(null));

    try {
      const response = await api.consumer.fetchFutureBookings();
      const futureBookings = response.data.results;

      const response_ = await api.consumer.fetchPastBookings();
      const pastBookings = response_.data.results;
      dispatch(fetchedBookings({ futureBookings, pastBookings }));
    } catch (err) {
      console.error(err);
      dispatch(fetchBookingError(err));
    }
  };
}

export function startFetchOptions() {
  return { type: types.CONSUMER_START_FETCH_OPTIONS };
}
export function errorFetchingOptions(error: ?Error) {
  return { type: types.CONSUMER_ERROR_FETCHING_OPTIONS, error };
}
export function fetchedOptions(bookingOptions: Array<BookingOption>) {
  return { type: types.CONSUMER_HAS_FETCHED_OPTIONS, bookingOptions };
}
export function fetchOptions() {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchOptions());
    dispatch(errorFetchingOptions(null));

    try {
      const response = await api.consumer.fetchOptions();
      const bookingOptions = response.data;

      dispatch(fetchedOptions(bookingOptions));
    } catch (err) {
      dispatch(errorFetchingOptions(err));
    }
  };
}

export function startCancellingOption(optionId: number) {
  return { type: types.CONSUMER_CANCELLING_BOOKING_OPTION, optionId };
}
export function optionCancelled(optionId: number) {
  return { type: types.CONSUMER_BOOKING_OPTION_CANCELLED, optionId };
}
export function errorCancellingOption(error: ?Error) {
  return { type: types.CONSUMER_ERROR_CANCELLING_BOOKING_OPTION, error };
}
export function cancelBookingOption(optionId: number) {
  return async (dispatch: Dispatch, getState: () => State) => {
    if (getState().consumer.optionCurrentlyCancelling !== null) {
      return;
    }
    dispatch(startCancellingOption(optionId));
    dispatch(errorCancellingOption(null));

    try {
      await api.consumer.discardBookingOption(optionId);
      dispatch(optionCancelled(optionId));
    } catch (err) {
      console.error(err);
      dispatch(errorCancellingOption(err));
    }
  };
}

export function startFetchConsumerPaymentPacks() {
  return { type: types.CONSUMER_START_FETCH_PAYMENT_PACKS };
}
export function errorFetchingConsumerPaymentPacks(error: ?Error) {
  return { type: types.CONSUMER_ERROR_FETCHING_PAYMENT_PACKS, error };
}
export function fetchedConsumerPaymentPacks(
  consumerPaymentPacks: Array<ConsumerPaymentPack>,
) {
  return {
    type: types.CONSUMER_HAS_FETCHED_PAYMENT_PACKS,
    consumerPaymentPacks,
  };
}
export function fetchConsumerPaymentPacks() {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchConsumerPaymentPacks());
    dispatch(errorFetchingConsumerPaymentPacks(null));

    try {
      const response = await api.consumer.fetchConsumerPaymentPacks();
      const consumerPaymentPacks = response.data;

      dispatch(fetchedConsumerPaymentPacks(consumerPaymentPacks));
    } catch (err) {
      dispatch(errorFetchingConsumerPaymentPacks(err));
    }
  };
}

export function startFetchProfile() {
  return { type: types.CONSUMER_START_FETCH_PROFILE };
}
export function errorFetchingProfile(error: ?Error) {
  return { type: types.CONSUMER_ERROR_FETCHING_PROFILE, error };
}
export function fetchedProfile(profile: Profile) {
  return {
    type: types.CONSUMER_HAS_FETCHED_PROFILE,
    profile,
  };
}
export function fetchProfile(options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchProfile());
    dispatch(errorFetchingProfile(null));

    try {
      const response = await api.consumer.fetchProfile();
      const profile = response.data;
      dispatch(fetchedProfile(profile));
      if (options && options.onSuccess) options.onSuccess(profile);
    } catch (err) {
      dispatch(errorFetchingProfile(err));
      if (options && options.onError) options.onError(err);
    }
  };
}

export function discardBookingStart(bookingId: number) {
  return { type: types.CONSUMER_BOOKING_DISCARD_START, bookingId };
}
export function discardBookingSuccess(bookingId: number) {
  return { type: types.CONSUMER_BOOKING_DISCARD_SUCCESS, bookingId };
}
export function discardBookingError(error: ?Error) {
  return { type: types.CONSUMER_BOOKING_DISCARD_ERROR, error };
}
export function discardBooking(bookingId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(discardBookingStart(bookingId));
    dispatch(discardBookingError(null));

    try {
      await api.consumer.discardBooking(bookingId);
      dispatch(discardBookingSuccess(bookingId));
    } catch (err) {
      console.error(err);
      dispatch(discardBookingError(err));
    }
  };
}
