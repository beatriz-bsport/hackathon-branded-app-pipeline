// @flow

import {
  edit as editAPI,
  create as createAPI,
  fetchAllPaymentPacks as fetchAllPaymentPacksAPI,
  patch as patchAPI,
} from './api';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';
import { actionTypes as types } from './types';

import type { Dispatch } from '../../state/types';

export function fetchedAllPaymentPacks(paymentPacks: Array<PaymentPack>) {
  return { type: types.HAS_FETCHED_ALL_PAYMENT_PACKS, paymentPacks };
}
export function startFetchAllPaymentPacks() {
  return { type: types.START_FETCH_ALL_PAYMENT_PACKS };
}

export function errorFetchingAllPaymentPacks(error: ?Error) {
  return { type: types.ERROR_FETCHING_ALL_PAYMENT_PACKS, error };
}

export function refreshAllPaymentPack() {
  return async (dispatch: Dispatch) => {
    dispatch(errorFetchingAllPaymentPacks(null));
    try {
      const response = await fetchAllPaymentPacksAPI();
      const paymentPacks = response.data;
      dispatch(fetchedAllPaymentPacks(paymentPacks));
    } catch (err) {
      console.error(err);
      dispatch(errorFetchingAllPaymentPacks(err));
    }
  };
}

export function fetchAllPaymentPacks() {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchAllPaymentPacks());
    dispatch(refreshAllPaymentPack());
  };
}

export function patch(id: number, data: [*]) {
  return async (dispatch: Dispatch) => {
    dispatch(startPatchingPack(id));

    try {
      const response = await patchAPI(id, data);
      if (response.status === 200) {
        dispatch(patchedPack(response.data));
        dispatch(snackbarSuccess('form.paymentPack.update.success'));
      } else {
        dispatch(errorPatchingPack(id));
        dispatch(snackbarError('form.paymentPack.update.error'));
      }
    } catch (err) {
      console.error(err);
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
    dispatch(startCreateOrUpdate(data.id));
    dispatch(createOrUpdateFailed(null));
    try {
      let apiCall = null;
      if (data.id) {
        apiCall = editAPI;
      } else {
        apiCall = createAPI;
      }
      const response = await apiCall(data);

      if (response.status === 200) {
        dispatch(createOrUpdateSuccess(response.data));
        dispatch(snackbarSuccess('paymentPack.createOrUpdate.success'));
        if (options.onSuccess) options.onSuccess();
      }
    } catch (err) {
      console.error(err);
      dispatch(createOrUpdateFailed(err));
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

export function createOrUpdateFailed(error: ?Error) {
  return { type: types.PAYMENT_PACK_CREATEORUPDATE_FAIL, error };
}
