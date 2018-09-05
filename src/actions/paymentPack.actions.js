import api from '../api';
import types from './paymentPack.types';

export function fetchedAllPaymentPacks(paymentPacks) {
  return { type: types.HAS_FETCHED_ALL_PAYMENT_PACKS, paymentPacks };
}
export function startFetchAllPaymentPacks() {
  return { type: types.START_FETCH_ALL_PAYMENT_PACKS };
}

export function errorFetchingAllPaymentPacks(err) {
  return { type: types.ERROR_FETCHING_ALL_PAYMENT_PACKS, err };
}

export function refreshAllPaymentPack() {
  return async (dispatch) => {
    try {
      const response = await api.paymentPack.fetchAll();
      const paymentPacks = response.data;
      dispatch(fetchedAllPaymentPacks(paymentPacks));
    } catch (err) {
      dispatch(errorFetchingAllPaymentPacks(JSON.stringify(err)));
    }
  };
}

export function fetchAll() {
  return async (dispatch) => {
    dispatch(startFetchAllPaymentPacks());
    dispatch(refreshAllPaymentPack());
  };
}

export function startUpdatingCredit(consumerPackId) {
  return { type: types.UPDATING_CONSUMER_PACK_CREDIT, consumerPackId };
}

export function updateCreditDone(consumerPackId) {
  return { type: types.UPDATE_CONSUMER_PACK_CREDIT_DONE, consumerPackId };
}

export function updateCreditFailed(consumerPackId) {
  return { type: types.UPDATE_CONSUMER_PACK_CREDIT_FAILED, consumerPackId };
}

export function addCredit(consumerPackId, nbCredit) {
  return async (dispatch) => {
    dispatch(startUpdatingCredit(consumerPackId));
    try {
      let apiCall = () => {};
      if (nbCredit >= 0) {
        apiCall = api.paymentPack.addCredit;
      } else {
        apiCall = api.paymentPack.subCredit;
      }
      const response = await apiCall(
        consumerPackId,
        nbCredit >= 0 ? nbCredit : -nbCredit,
      );
      if (response.status === 200) {
        dispatch(refreshAllPaymentPack());
        dispatch(updateCreditDone(consumerPackId));
      } else {
        dispatch(updateCreditFailed(consumerPackId));
      }
    } catch (err) {
      dispatch(updateCreditFailed(consumerPackId));
    }
  };
}
