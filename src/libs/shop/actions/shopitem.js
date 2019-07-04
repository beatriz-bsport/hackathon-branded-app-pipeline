// @flow

import * as api from '../api';
import types from '../action.types';

import {
  snackbarSuccess,
  snackbarError,
} from '../../../actions/snackbar.actions';
import type { Dispatch } from '../../../state/types';

export function shopFetchStart() {
  return { type: types.SHOP_FETCH_START };
}
export function shopFetchSuccess(shopItems: Array<ShopItem>) {
  return { type: types.SHOP_FETCH_SUCCESS, shopItems };
}
export function shopFetchError() {
  return { type: types.SHOP_FETCH_ERROR };
}

export function fetchAll(companyId: ?number) {
  return async (dispatch: Dispatch) => {
    dispatch(shopFetchStart());
    try {
      const response = await api.fetchAll({ companyId });
      if (response.status === 200) {
        const shopItems = response.data;
        return dispatch(shopFetchSuccess(shopItems));
      }
      return dispatch(shopFetchError());
    } catch (e) {
      return dispatch(shopFetchError());
    }
  };
}

export function shopItemFetchStart() {
  return { type: types.SHOP_ITEM_FETCH_START };
}
export function shopItemFetchSuccess(shopitem: ShopItem) {
  return { type: types.SHOP_ITEM_FETCH_SUCCESS, shopitem };
}
export function shopItemFetchError() {
  return { type: types.SHOP_ITEM_FETCH_ERROR };
}

export function fetchShopItem(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemFetchStart());
    try {
      const { data, status } = await api.fetchShopItem(id);
      if (status === 200) {
        return dispatch(shopItemFetchSuccess(data));
      }
      return dispatch(shopItemFetchError());
    } catch (e) {
      return dispatch(shopItemFetchError());
    }
  };
}

export function createOrUpdateShopItem(shopItemData: *, id: ?number) {
  return async (dispatch: Dispatch) => {
    dispatch(actionCreateOrUpdateShopItemStart(shopItemData));

    const createOrUpdate = id ? api.updateItem : api.createItem;
    try {
      const response = await createOrUpdate(shopItemData, id);

      if (response.status === 201 || response.status === 200) {
        dispatch(actionCreateOrUpdateShopItemSuccess(response.data));
        dispatch(snackbarSuccess('form.shop.item.createOrUpdate.success'));
      } else {
        dispatch(snackbarError('form.shop.item.createOrUpdate.error'));
        dispatch(actionCreateOrUpdateShopItemError(response.data));
      }
    } catch (e) {
      console.log(e);
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

export function deleteItem(id: number) {
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
      } else {
        dispatch(snackbarError('form.shop.item.delete.error'));
        dispatch(actionDeleteError(response.data));
      }
    } catch (e) {
      console.log(e);
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
