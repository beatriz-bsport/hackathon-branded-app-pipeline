// @flow

import api from '../api';
import { snackbarSuccess } from './snackbar.actions';
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

export function updateCreditDone(consumerPackId, nbCredit) {
  return {
    type: types.UPDATE_CONSUMER_PACK_CREDIT_DONE,
    consumerPackId,
    nbCredit,
  };
}

export function updateCreditFailed(consumerPackId) {
  return { type: types.UPDATE_CONSUMER_PACK_CREDIT_FAILED, consumerPackId };
}

export function addCredit(consumerPackId, nbCredit) {
  return async (dispatch) => {
    dispatch(startUpdatingCredit(consumerPackId));
    try {
      const apiCall =
        api.paymentPack[nbCredit >= 0 ? 'addCredit' : 'subCredit'];
      const response = await apiCall(
        consumerPackId,
        nbCredit >= 0 ? nbCredit : -nbCredit,
      );
      if (response.status === 200) {
        dispatch(refreshAllPaymentPack());
        dispatch(updateCreditDone(consumerPackId, nbCredit));
        dispatch(snackbarSuccess('paymentPack.credit.updated'));
      } else {
        dispatch(updateCreditFailed(consumerPackId));
      }
    } catch (err) {
      dispatch(updateCreditFailed(consumerPackId));
    }
  };
}
