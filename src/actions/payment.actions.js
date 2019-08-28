import api from '../api';
import types from './payment.types';

export function startCheckingOptionExistence() {
  return { type: types.PAYMENT_START_CHECKING_OPTION_EXISTENCE };
}
export function errorCheckingOptionExistence() {
  return { type: types.PAYMENT_ERROR_CHEKING_OPTION_EXISTENCE };
}
export function checkedOptionExistence(exists) {
  return { type: types.PAYMENT_HAS_CHECKED_OPTION_EXISTENCE, exists };
}
export function checkOptionExistence(offerId) {
  return async (dispatch) => {
    dispatch(startCheckingOptionExistence());

    try {
      const response = await api.booking.checkOptionExistence(offerId);
      const exists = response.data;
      dispatch(checkedOptionExistence(exists));
    } catch (err) {
      dispatch(errorCheckingOptionExistence());
    }
  };
}

export function startFetchBookingOption() {
  return { type: types.PAYMENT_START_FETCH_OPTION };
}
export function errorFetchingBookingOption() {
  return { type: types.PAYMENT_ERROR_FETCHING_OPTION };
}
export function fetchedBookingOption(option) {
  return { type: types.PAYMENT_HAS_FETCHED_OPTION, option };
}
export function fetchBookingOption(id) {
  return async (dispatch) => {
    dispatch(startFetchBookingOption());

    try {
      const response = await api.payment.fetchBookingOption(id);
      const option = response.data;
      dispatch(fetchedBookingOption(option));
    } catch (err) {
      dispatch(errorFetchingBookingOption());
    }
  };
}

export function startFetchOffer() {
  return { type: types.PAYMENT_START_FETCH_OFFER };
}
export function errorFetchingOffer(err) {
  return { type: types.PAYMENT_ERROR_FETCHING_OFFER, err };
}
export function fetchedOffer(offer) {
  return { type: types.PAYMENT_HAS_FETCHED_OFFER, offer };
}
export function fetchOffer(id) {
  return async (dispatch) => {
    dispatch(startFetchOffer());

    try {
      const response = await api.payment.fetchOffer(id);
      const offer = response.data;
      dispatch(fetchedOffer(offer));
    } catch (err) {
      dispatch(errorFetchingOffer(err));
    }
  };
}

export function startFetchPaymentPack() {
  return { type: types.PAYMENT_START_FETCH_PAYMENT_PACK };
}
export function errorFetchingPaymentPack() {
  return { type: types.PAYMENT_ERROR_FETCHING_PAYMENT_PACK };
}
export function fetchedPaymentPack(paymentPack) {
  return { type: types.PAYMENT_HAS_FETCHED_PAYMENT_PACK, paymentPack };
}
export function fetchPaymentPack(id) {
  return async (dispatch) => {
    dispatch(startFetchPaymentPack());

    try {
      const response = await api.payment.fetchPaymentPack(id);
      const paymentPack = response.data;
      dispatch(fetchedPaymentPack(paymentPack));
    } catch (err) {
      dispatch(errorFetchingPaymentPack());
    }
  };
}

export function startFetchCompatiblePass() {
  return { type: types.PAYMENT_START_FETCH_COMPATIBLE_PASS };
}
export function errorFetchingCompatiblePass() {
  return { type: types.PAYMENT_ERROR_FETCHING_COMPATIBLE_PASS };
}
export function fetchedCompatiblePass(consumerPacks) {
  return { type: types.PAYMENT_HAS_FETCHED_COMPATIBLE_PASS, consumerPacks };
}
export function fetchCompatiblePass(offerId, memberId) {
  return async (dispatch) => {
    dispatch(startFetchCompatiblePass());

    try {
      const response = await api.payment.fetchCompatiblePass(offerId, memberId);
      const consumerPacks = response.data;
      dispatch(fetchedCompatiblePass(consumerPacks));
    } catch (err) {
      dispatch(errorFetchingCompatiblePass());
    }
  };
}
export function startFetchCompatiblePaymentPacks() {
  return { type: types.PAYMENT_START_FETCH_COMPATIBLE_PAYMENT_PACKS };
}
export function errorFetchingCompatiblePaymentPacks() {
  return { type: types.PAYMENT_ERROR_FETCHING_COMPATIBLE_PAYMENT_PACKS };
}
export function fetchedCompatiblePaymentPacks(paymentPacks) {
  return {
    type: types.PAYMENT_HAS_FETCHED_COMPATIBLE_PAYMENT_PACKS,
    paymentPacks,
  };
}
export function fetchCompatiblePaymentPacks(offerId) {
  return async (dispatch) => {
    dispatch(startFetchCompatiblePaymentPacks());

    try {
      const response = await api.payment.fetchCompatiblePaymentPacks(offerId);
      const paymentPacks = response.data;
      dispatch(fetchedCompatiblePaymentPacks(paymentPacks));
    } catch (err) {
      dispatch(errorFetchingCompatiblePaymentPacks());
    }
  };
}
