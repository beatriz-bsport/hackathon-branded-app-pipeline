// @flow

import * as api from '../api';
import types from '../action.types';

import {
  snackbarSuccess,
  snackbarError,
} from '../../../actions/snackbar.actions';
import type { Dispatch } from '../../../state/types';

import type { SubShopAPI } from '../types';

export function subShopFetchStart() {
  return { type: types.SUB_SHOP_FETCH_START };
}
export function subShopFetchSuccess(subShops: Array<SubShopAPI>) {
  return { type: types.SUB_SHOP_FETCH_SUCCESS, subShops };
}
export function subShopFetchError() {
  return { type: types.SUB_SHOP_FETCH_ERROR };
}

export function fetchAllSubShop(companyId: ?number) {
  return async (dispatch: Dispatch) => {
    dispatch(subShopFetchStart());
    try {
      const response = await api.fetchAllSubShop({ companyId });
      if (response.status === 200) {
        const subShops = response.data;
        return dispatch(subShopFetchSuccess(subShops));
      }
      return dispatch(subShopFetchError());
    } catch (e) {
      return dispatch(subShopFetchError());
    }
  };
}

export function createOrUpdateSubShop({
  name,
  id,
}: {
  name: string,
  id: ?number,
}) {
  return async (dispatch: Dispatch) => {
    dispatch(actionCreateOrUpdateSubShopStart());

    const createOrUpdate = id ? api.updateSubShop : api.createSubShop;
    try {
      const response = await createOrUpdate({ name, id });

      switch (response.status) {
        case 201:
          dispatch(actionCreateSubShopSuccess(response.data));
          return dispatch(
            snackbarSuccess('form.shop.subShop.createOrUpdate.success'),
          );
        case 200:
          dispatch(actionUpdateSubShopSuccess(response.data));
          return dispatch(
            snackbarSuccess('form.shop.subShop.createOrUpdate.success'),
          );
        default:
          dispatch(snackbarError('form.shop.subShop.createOrUpdate.error'));
          return dispatch(actionCreateOrUpdateSubShopError(response.data));
      }
    } catch (e) {
      console.log(e);
      dispatch(snackbarError('form.shop.subShop.createOrUpdate.error'));
      return dispatch(actionCreateOrUpdateSubShopError(e));
    }
  };
}

export function actionCreateOrUpdateSubShopStart() {
  return { type: types.SUB_SHOP_ITEM_CREATEORUPDATE_START };
}
export function actionCreateSubShopSuccess(subShop: SubShop) {
  return { type: types.SUB_SHOP_CREATE_SUCCESS, subShop };
}
export function actionUpdateSubShopSuccess(subShop: SubShop) {
  return { type: types.SUB_SHOP_UPDATE_SUCCESS, subShop };
}
export function actionCreateOrUpdateSubShopError(error: ?Error) {
  return { type: types.SUB_SHOP_CREATEORUPDATE_ERROR, error };
}

export function deleteSubShop(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(actionDeleteSubShopStart(id));

    try {
      const response = await api.deleteSubShop(id);

      if (response.status === 204) {
        dispatch(actionDeleteSubShopSuccess(id));
        dispatch(snackbarSuccess('form.shop.subShop.delete.success'));
      } else {
        dispatch(snackbarError('form.shop.subShop.delete.error'));
        dispatch(actionDeleteSubShopError(response.data));
      }
    } catch (e) {
      console.log(e);
      dispatch(snackbarError('form.shop.subShop.delete.error'));
      dispatch(actionDeleteSubShopError(e));
    }
  };
}

export function actionDeleteSubShopStart(id: number) {
  return { type: types.SUB_SHOP_DELETE_START, id };
}
export function actionDeleteSubShopSuccess(id: number) {
  return { type: types.SUB_SHOP_DELETE_SUCCESS, id };
}
export function actionDeleteSubShopError(error: ?Error) {
  return { type: types.SUB_SHOP_DELETE_ERROR, error };
}

export default {
  fetchAllSubShop,
  createOrUpdateSubShop,
  deleteSubShop,
};
