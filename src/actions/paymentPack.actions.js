// @flow

import api from '../api';
import { snackbarSuccess, snackbarError } from './snackbar.actions';
import types from './paymentPack.types';

import type { Dispatch } from '../state/types';

export function fetchedAllPaymentPacks(paymentPacks: Array<PaymentPack>) {
  return { type: types.HAS_FETCHED_ALL_PAYMENT_PACKS, paymentPacks };
}
export function startFetchAllPaymentPacks() {
  return { type: types.START_FETCH_ALL_PAYMENT_PACKS };
}

export function errorFetchingAllPaymentPacks(err: Error) {
  return { type: types.ERROR_FETCHING_ALL_PAYMENT_PACKS, err };
}

export function refreshAllPaymentPack() {
  return async (dispatch: Dispatch) => {
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
  return async (dispatch: Dispatch) => {
    dispatch(startFetchAllPaymentPacks());
    dispatch(refreshAllPaymentPack());
  };
}

export function patch(id: number, data: [*]) {
  return async (dispatch: Dispatch) => {
    dispatch(startPatchingPack(id));

    try {
      const response = await api.paymentPack.patch(id, data);
      if (response.status === 200) {
        dispatch(patchedPack(response.data));
        dispatch(snackbarSuccess('form.paymentPack.update.success'));
      } else {
        dispatch(errorPatchingPack(id));
        dispatch(snackbarError('form.paymentPack.update.error'));
      }
    } catch (err) {
      dispatch(errorPatchingPack(id));
      dispatch(snackbarError('form.paymentPack.update.error'));
    }
  };
}

export function startPatchingPack(id: number) {
  return { type: types.PAYMENT_PACK_PATCH_START, id };
}

export function patchedPack(paymentPack: PaymentPack) {
  return { type: types.PAYMENT_PACK_PATCH_SUCCESS, paymentPack };
}

export function errorPatchingPack(id: number) {
  return { type: types.PAYMENT_PACK_PATCH_ERROR, id };
}

export function createOrUpdate(data: PaymentPackFormData, options = {}) {
  return async (dispatch: Dispatch) => {
    dispatch(startCreateOrUpdate());
    try {
      let apiCall = null;
      if (data.id) {
        apiCall = api.paymentPack.edit;
      } else {
        apiCall = api.paymentPack.create;
      }
      const response = await apiCall(data);

      if (response.status === 200) {
        dispatch(createOrUpdateSuccess(response.data));
        dispatch(snackbarSuccess('paymentPack.createOrUpdate.success'));
        if (options.onSuccess) options.onSuccess();
      }
    } catch (err) {
      console.log(err);
      dispatch(createOrUpdateFailed());
      dispatch(snackbarError('paymentPack.createOrUpdate.fail'));
      if (options.onError) options.onError();
    }
  };
}

export function startCreateOrUpdate(id: number) {
  return { type: types.PAYMENT_PACK_CREATEORUPDATE_START, id };
}
export function createOrUpdateSuccess(paymentPack: PaymentPack) {
  return { type: types.PAYMENT_PACK_CREATEORUPDATE_SUCCESS, paymentPack };
}

export function createOrUpdateFailed() {
  return { type: types.PAYMENT_PACK_CREATEORUPDATE_FAIL };
}
