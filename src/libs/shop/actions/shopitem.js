// @flow

import uniq from 'lodash/uniq';

import * as api from '../api';
import types from '../action.types';

import {
  snackbarSuccess,
  snackbarError,
} from '../../../actions/snackbar.actions';
import type { Dispatch } from '../../../state/types';
import { getFreshShopIds } from '../selectors';

export function shopFetchStart() {
  return { type: types.SHOP_FETCH_START };
}
export function shopFetchSuccess(shopItems: Array<ShopItem>) {
  return { type: types.SHOP_FETCH_SUCCESS, shopItems };
}
export function shopFetchError(error: ?Error) {
  return { type: types.SHOP_FETCH_ERROR, error };
}

export function fetchAll(companyId: ?number) {
  return async (dispatch: Dispatch) => {
    dispatch(shopFetchStart());
    try {
      const response = await api.fetchAll({ companyId });
      const shopItems = response.data;
      dispatch(shopFetchSuccess(shopItems));
    } catch (e) {
      dispatch(shopFetchError(e));
    }
  };
}

export function fetchBulk(companyId: ?number, ids = Array) {
  return async (dispatch: Dispatch, getState: () => State) => {
    const freshShopList = getFreshShopIds(getState());
    const ids_uniq = uniq(ids.filter((id) => !!id)).filter(
      (id) => !freshShopList.includes(id),
    );
    if (ids_uniq.length === 0) {
      return;
    }
    try {
      const response = await api.fetchOld({
        company: companyId,
        id__in: ids_uniq,
      });
      const shopItems = response.data;
      dispatch(shopFetchSuccess(shopItems));
    } catch (e) {
      dispatch(shopFetchError(e));
    }
  };
}

export function shopItemFetchStart() {
  return { type: types.SHOP_ITEM_FETCH_START };
}
export function shopItemFetchSuccess(shopitem: ShopItem) {
  return { type: types.SHOP_ITEM_FETCH_SUCCESS, shopitem };
}
export function shopItemFetchError(error: ?Error) {
  return { type: types.SHOP_ITEM_FETCH_ERROR, error };
}

export function fetchShopItem(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemFetchStart());
    dispatch(shopItemFetchError());
    try {
      const { data } = await api.fetchShopItem(id);
      dispatch(shopItemFetchSuccess(data));
    } catch (e) {
      dispatch(shopItemFetchError(e));
    }
  };
}

export function createOrUpdateShopItem(shopItemData: *, id: ?number) {
  return async (dispatch: Dispatch) => {
    dispatch(actionCreateOrUpdateShopItemStart(shopItemData));

    const createOrUpdate = id ? api.updateItem : api.createItem;
    try {
      const response = await createOrUpdate(shopItemData, id);

      dispatch(actionCreateOrUpdateShopItemSuccess(response.data));
      dispatch(snackbarSuccess('form.shop.item.createOrUpdate.success'));
    } catch (e) {
      console.error(e);
      dispatch(snackbarError('form.shop.item.createOrUpdate.error'));
      dispatch(actionCreateOrUpdateShopItemError(e));
    }
  };
}

export function actionCreateOrUpdateShopItemStart(shopItemData: *) {
  return { type: types.SHOP_ITEM_CREATEOR_UPDATE_START, shopItemData };
}
export function actionCreateOrUpdateShopItemSuccess(shopItem: ShopItem) {
  return { type: types.SHOP_ITEM_CREATEOR_UPDATE_SUCCESS, shopItem };
}
export function actionCreateOrUpdateShopItemError(error: ?Error) {
  return { type: types.SHOP_ITEM_CREATEOR_UPDATE_ERROR, error };
}

export function deleteItem(id: number, callback: ?() => void) {
  return async (dispatch: Dispatch) => {
    dispatch(actionDeleteStart(id));

    try {
      const response = await api.deleteItem(id);

      if (
        response.status === 201 ||
        response.status === 200 ||
        response.status === 204
      ) {
        dispatch(actionDeleteSuccess(id));
        dispatch(snackbarSuccess('form.shop.item.delete.success'));
        if (typeof callback === 'function') {
          callback();
        }
      } else {
        dispatch(snackbarError('form.shop.item.delete.error'));
        dispatch(actionDeleteError(response.data));
      }
    } catch (e) {
      console.error(e);
      dispatch(snackbarError('form.shop.item.delete.error'));
      dispatch(actionDeleteError(e));
    }
  };
}

export function actionDeleteStart(id: number) {
  return { type: types.SHOP_ITEM_DELETE_START, id };
}
export function actionDeleteSuccess(id: number) {
  return { type: types.SHOP_ITEM_DELETE_SUCCESS, id };
}
export function actionDeleteError(error: ?Error) {
  return { type: types.SHOP_ITEM_DELETE_ERROR, error };
}

export default {
  deleteItem,
  createOrUpdateShopItem,
  fetchShopItem,
  fetchAll,
};
