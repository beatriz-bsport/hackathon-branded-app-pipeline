import api from '../api';
import types from './shop.types';

import { snackbarSuccess, snackbarError } from './snackbar.actions';

export function subShopFetchStart() {
  return { type: types.SUB_SHOP_FETCH_START };
}
export function subShopFetchSuccess(subShops) {
  return { type: types.SUB_SHOP_FETCH_SUCCESS, subShops };
}
export function subShopFetchError() {
  return { type: types.SUB_SHOP_FETCH_ERROR };
}

export function fetchAllSubShop() {
  return async (dispatch) => {
    dispatch(subShopFetchStart());
    try {
      const response = await api.shop.fetchAllSubShop();
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

export function shopFetchStart() {
  return { type: types.SHOP_FETCH_START };
}
export function shopFetchSuccess(shopItems) {
  return { type: types.SHOP_FETCH_SUCCESS, shopItems };
}
export function shopFetchError() {
  return { type: types.SHOP_FETCH_ERROR };
}

export function fetchAll() {
  return async (dispatch) => {
    dispatch(shopFetchStart());
    try {
      const response = await api.shop.fetchAll();
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

export function createOrUpdateShopItem(shopItemData, id) {
  return async (dispatch) => {
    dispatch(actionCreateOrUpdateShopItemStart(shopItemData));

    const createOrUpdate = id ? api.shop.updateItem : api.shop.createItem;
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

export function actionCreateOrUpdateShopItemStart(shopItemData) {
  return { type: types.SHOP_ITEM_CREATEOR_UPDATE_START, shopItemData };
}
export function actionCreateOrUpdateShopItemSuccess(shopItem) {
  return { type: types.SHOP_ITEM_CREATEOR_UPDATE_SUCCESS, shopItem };
}
export function actionCreateOrUpdateShopItemError(error) {
  return { type: types.SHOP_ITEM_CREATEOR_UPDATE_ERROR, error };
}

export function deleteItem(id) {
  return async (dispatch) => {
    dispatch(actionDeleteStart(id));

    try {
      const response = await api.shop.deleteItem(id);

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

export function actionDeleteStart(id) {
  return { type: types.SHOP_ITEM_DELETE_START, id };
}
export function actionDeleteSuccess(id) {
  return { type: types.SHOP_ITEM_DELETE_SUCCESS, id };
}
export function actionDeleteError(error) {
  return { type: types.SHOP_ITEM_DELETE_ERROR, error };
}

export function updateProvisions(nb, id) {
  return async (dispatch) => {
    dispatch(actionUpdateProvisionsStart(id));

    try {
      const response = await api.shop.updateProvisions(nb, id);

      if (
        response.status === 201 ||
        response.status === 200 ||
        response.status === 204
      ) {
        dispatch(actionUpdateProvisionsSuccess(response.data));
        dispatch(snackbarSuccess('form.shop.item.updateProvisions.success'));
      } else {
        dispatch(snackbarError('form.shop.item.updateProvisions.error'));
        dispatch(actionUpdateProvisionsError(response.data));
      }
    } catch (e) {
      console.log(e);
      dispatch(snackbarError('form.shop.item.updateProvisions.error'));
      dispatch(actionUpdateProvisionsError(e));
    }
  };
}

export function actionUpdateProvisionsStart(id) {
  return { type: types.SHOP_ITEM_UPDATE_PROVISIONS_START, id };
}
export function actionUpdateProvisionsSuccess(shopItem) {
  return { type: types.SHOP_ITEM_UPDATE_PROVISIONS_SUCCESS, shopItem };
}
export function actionUpdateProvisionsError(error) {
  return { type: types.SHOP_ITEM_UPDATE_PROVISIONS_ERROR, error };
}

export function deleteProvision({ provisionId, shopItemId }) {
  return async (dispatch) => {
    dispatch(actionUpdateProvisionsStart(shopItemId));

    try {
      const response = await api.shop.deleteProvision({
        shopItemId,
        provisionId,
      });

      if (
        response.status === 201 ||
        response.status === 200 ||
        response.status === 204
      ) {
        dispatch(actionUpdateProvisionsSuccess(response.data));
        dispatch(snackbarSuccess('form.shop.item.updateProvisions.success'));
      } else {
        dispatch(snackbarError('form.shop.item.updateProvisions.error'));
        dispatch(actionUpdateProvisionsError(response.data));
      }
    } catch (e) {
      console.log(e);
      dispatch(snackbarError('form.shop.item.updateProvisions.error'));
      dispatch(actionUpdateProvisionsError(e));
    }
  };
}

export function createOrUpdateSubShop({ name, id }) {
  return async (dispatch) => {
    dispatch(actionCreateOrUpdateSubShopStart());

    const createOrUpdate = id ? api.shop.updateSubShop : api.shop.createSubShop;
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
export function actionCreateSubShopSuccess(subShop) {
  return { type: types.SUB_SHOP_CREATE_SUCCESS, subShop };
}
export function actionUpdateSubShopSuccess(subShop) {
  return { type: types.SUB_SHOP_UPDATE_SUCCESS, subShop };
}
export function actionCreateOrUpdateSubShopError(error) {
  return { type: types.SUB_SHOP_CREATEORUPDATE_ERROR, error };
}

export function deleteSubShop(id) {
  return async (dispatch) => {
    dispatch(actionDeleteSubShopStart(id));

    try {
      const response = await api.shop.deleteSubShop(id);

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

export function actionDeleteSubShopStart(id) {
  return { type: types.SUB_SHOP_DELETE_START, id };
}
export function actionDeleteSubShopSuccess(id) {
  return { type: types.SUB_SHOP_DELETE_SUCCESS, id };
}
export function actionDeleteSubShopError(error) {
  return { type: types.SUB_SHOP_DELETE_ERROR, error };
}
