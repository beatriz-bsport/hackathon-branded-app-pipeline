import api from '../api';
import types from './payment.types';

export function startFetchOffer() {
  return { type: types.PAYMENT_START_FETCH_OFFER };
}
export function errorFetchingOffer() {
  return { type: types.PAYMENT_ERROR_FETCHING_OFFER };
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
      dispatch(errorFetchingOffer());
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
export function fetchCompatiblePass(offerId) {
  return async (dispatch) => {
    dispatch(startFetchCompatiblePass());

    try {
      const response = await api.payment.fetchCompatiblePass(offerId);
      const consumerPacks = response.data;
      dispatch(fetchedCompatiblePass(consumerPacks));
    } catch (err) {
      dispatch(errorFetchingCompatiblePass());
    }
  };
}
