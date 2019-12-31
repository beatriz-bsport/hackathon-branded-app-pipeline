// @flow

import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';

import {
  edit as editAPI,
  create as createAPI,
  fetchAllPaymentPacks as fetchAllPaymentPacksAPI,
  patch as patchAPI,
  fetchOne as fetchOneAPI,
  fetchPaymentPackList as fetchPaymentPackListAPI,
} from './api';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';
import { actionTypes as types } from './types';
import { createDictionnaryById, createIdList } from '../../actions/utils';

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

export const fetchOneAction = {
  isLoading: createAction('PAYMENT_PACK/DETAIL/IS_LOADING'),
  error: createAction('PAYMENT_PACK/DETAIL/ERROR'),
  success: createAction('PAYMENT_PACK/DETAIL/SUCCESS'),
};

export function fetchOne(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchOneAction.isLoading(true));
    dispatch(fetchOneAction.error(null));
    try {
      const response = await fetchOneAPI(id);
      dispatch(fetchOneAction.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(fetchOneAction.error(id));
    }
    dispatch(fetchOneAction.isLoading(false));
  };
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

export function resetCompatiblePaymentPacks() {
  return async (dispatch: Dispatch) => {
    dispatch(fetchActivityCompatibleAction.reset());
  };
}

export const fetchActivityCompatibleAction = {
  reset: createAction('PAYMENT_PACK/BY_ACTIVITY/RESET'),
  isLoading: createAction('PAYMENT_PACK/BY_ACTIVITY/IS_LOADING'),
  error: createAction('PAYMENT_PACK/BY_ACTIVITY/ERROR'),
  success: createAction('PAYMENT_PACK/BY_ACTIVITY/SUCCESS'),
};

export function fetchActivityCompatiblePaymentPacks(
  meta_activity: number,
  page: number,
  page_size: number,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchActivityCompatibleAction.isLoading(true));
    dispatch(fetchActivityCompatibleAction.error(null));

    try {
      const response = await fetchPaymentPackListAPI({
        meta_activity,
        page,
        page_size,
        disabled: false,
      });
      const paymentPacksAllIds = createIdList(response.data.results);
      const paymentPacksById = createDictionnaryById(response.data.results);
      const { count } = response.data;

      dispatch(
        fetchActivityCompatibleAction.success({
          paymentPacksAllIds,
          paymentPacksById,
          count,
          page,
        }),
      );
    } catch (err) {
      dispatch(fetchActivityCompatibleAction.error(err));
    }
    dispatch(fetchActivityCompatibleAction.isLoading(false));
  };
}

export const fetchMarketplacePacksAction = {
  isLoading: createAction('PAYMENT_PACK/MARKETPLACE/IS_LOADING'),
  error: createAction('PAYMENT_PACK/MARKETPLACE/ERROR'),
  success: createAction('PAYMENT_PACK/MARKETPLACE/SUCCESS'),
};

export function fetchMarketplacePacks(params: any, options): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMarketplacePacksAction.isLoading(true));
    dispatch(fetchMarketplacePacksAction.error(null));

    try {
      const response = await fetchPaymentPackListAPI(params);
      const paymentPacksAllIds = createIdList(response.data.results);
      const paymentPacksById = createDictionnaryById(response.data.results);

      dispatch(
        fetchMarketplacePacksAction.success({
          paymentPacksAllIds,
          paymentPacksById,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(fetchMarketplacePacksAction.error(err));
    }
    dispatch(fetchMarketplacePacksAction.isLoading(false));
  };
}

export const paymentPackBulkActions = {
  isLoading: createAction('PAYMENT_PACK/BULK/IS_LOADING'),
  error: createAction('PAYMENT_PACK/BULK/ERROR'),
  success: createAction('PAYMENT_PACK/BULK/SUCCESS'),
};

export function fetchPaymentPackBulk(
  ids: Array<number>,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    const ids_uniq = uniq(ids);
    if (ids_uniq.length === 0) {
      return;
    }
    dispatch(paymentPackBulkActions.isLoading(true));
    dispatch(paymentPackBulkActions.error(null));

    try {
      const response = await fetchPaymentPackListAPI({
        id__in: ids_uniq,
        page_size: null,
      });
      const paymentPacksAllIds = createIdList(response.data.results);
      const paymentPacksById = createDictionnaryById(response.data.results);
      dispatch(
        paymentPackBulkActions.success({
          paymentPacksAllIds,
          paymentPacksById,
        }),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(paymentPackBulkActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(paymentPackBulkActions.isLoading(false));
  };
}
