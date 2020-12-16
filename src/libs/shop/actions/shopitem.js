// @flow

import uniq from 'lodash/uniq';
import { createAction } from 'redux-actions';

import * as api from '../api';

import {
  snackbarSuccess,
  snackbarError,
} from '../../../actions/snackbar.actions';
import type { Dispatch, OptionCallback } from '../../../state/types.ts';
import { getFreshShopIds } from '../selectors';

export const shopItemAsConsumerActions = {
  isLoading: createAction('SHOPITEM/AS_CONSUMER/LOADING'),
  error: createAction('SHOPITEM/AS_CONSUMER/ERROR'),
  success: createAction('SHOPITEM/AS_CONSUMER/SUCCESS'),
};

export function fetchShopItemAsConsumer(
  company: ?number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemAsConsumerActions.isLoading(true));
    dispatch(shopItemAsConsumerActions.error(null));
    try {
      const response = await api.fetchAll({
        marketplace_enabled: true,
        disabled: false,
        company,
        as_consumer: true,
      });
      dispatch(shopItemAsConsumerActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(shopItemAsConsumerActions.error(e));
      if (options && options.onError) {
        options.onError(e);
      }
    }
  };
}

export const shopItemFeaturedActions = {
  isLoading: createAction('SHOPITEM/FEATURED/LOADING'),
  error: createAction('SHOPITEM/FEATURED/ERROR'),
  success: createAction('SHOPITEM/FEATURED/SUCCESS'),
};

export function fetchShopItemFeatured(
  company: ?number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemFeaturedActions.isLoading(true));
    dispatch(shopItemFeaturedActions.error(null));
    try {
      const response = await api.fetchAll({
        marketplace_enabled: true,
        featured: true,
        disabled: false,
        company,
        as_consumer: true,
      });
      dispatch(shopItemFeaturedActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(shopItemFeaturedActions.error(e));
      if (options && options.onError) {
        options.onError(e);
      }
    }
  };
}

export const shopItemAsManagerActions = {
  isLoading: createAction('SHOPITEM/AS_MANAGER/LOADING'),
  error: createAction('SHOPITEM/AS_MANAGER/ERROR'),
  success: createAction('SHOPITEM/AS_MANAGER/SUCCESS'),
};

export function fetchShopItemAsManager(
  company: ?number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemAsManagerActions.isLoading(true));
    dispatch(shopItemAsManagerActions.error(null));

    try {
      const response = await api.fetchAll(company ? { company } : {});
      dispatch(shopItemAsManagerActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      dispatch(shopItemAsManagerActions.error(e));
      console.error(e);
      if (options && options.onError) {
        options.onError(e);
      }
    }
    dispatch(shopItemAsManagerActions.isLoading(false));
  };
}

export const shopItemBulkActions = {
  isLoading: createAction('SHOPITEM/BULK/LOADING'),
  error: createAction('SHOPITEM/BULK/ERROR'),
  success: createAction('SHOPITEM/BULK/SUCCESS'),
};

export function fetchBulk(companyId: ?number, ids = Array) {
  return async (dispatch: Dispatch, getState: () => State) => {
    const freshShopList = getFreshShopIds(getState());
    const ids_uniq = uniq(ids.filter((id) => !!id)).filter(
      (id) => !freshShopList.includes(id),
    );
    if (ids_uniq.length === 0) {
      return;
    }
    dispatch(shopItemBulkActions.isLoading(true));
    dispatch(shopItemBulkActions.error(null));
    try {
      const response = await api.fetchOld({
        company: companyId,
        id__in: ids_uniq,
      });
      dispatch(shopItemBulkActions.success(response.data));
    } catch (e) {
      dispatch(shopItemBulkActions.error(e));
    }
    dispatch(shopItemBulkActions.isLoading(false));
  };
}

export const shopItemRetrieveActions = {
  isLoading: createAction('SHOPITEM/RETRIEVE/LOADING'),
  error: createAction('SHOPITEM/RETRIEVE/ERROR'),
  success: createAction('SHOPITEM/RETRIEVE/SUCCESS'),
};

export function fetchShopItem(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemRetrieveActions.isLoading(true));
    dispatch(shopItemRetrieveActions.error(null));
    try {
      const response = await api.fetchShopItem(id);
      dispatch(shopItemRetrieveActions.success(response.data));
    } catch (e) {
      dispatch(shopItemRetrieveActions.error(e));
      console.error(e);
    }
    dispatch(shopItemRetrieveActions.isLoading(true));
  };
}

export const shopItemCreateOrUpdateActions = {
  isLoading: createAction('SHOPITEM/CREATE_OR_UPDATE/LOADING'),
  error: createAction('SHOPITEM/CREATE_OR_UPDATE/ERROR'),
  success: createAction('SHOPITEM/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateShopItem(
  shopItemData: *,
  id: ?number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemCreateOrUpdateActions.isLoading(true));
    dispatch(shopItemCreateOrUpdateActions.error(null));

    const createOrUpdate = id ? api.updateItem : api.createItem;
    try {
      const response = await createOrUpdate(shopItemData, id);

      dispatch(shopItemCreateOrUpdateActions.success(response.data));
      dispatch(snackbarSuccess('shop.item.createOrUpdate.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(snackbarError('shop.item.createOrUpdate.error'));
      dispatch(shopItemCreateOrUpdateActions.error(e));
      if (options && options.onError) {
        options.onError(e);
      }
    }
    dispatch(shopItemCreateOrUpdateActions.isLoading(false));
  };
}

export const shopItemDuplicateActions = {
  isLoading: createAction('SHOPITEM/DUPLICATE/LOADING'),
  error: createAction('SHOPITEM/DUPLICATE/ERROR'),
  success: createAction('SHOPITEM/DUPLICATE/SUCCESS'),
};

export function duplicateShopItem(
  id: number,
  suffix: string,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemDuplicateActions.isLoading(true));
    dispatch(shopItemDuplicateActions.error(null));

    try {
      const response = await api.duplicateItem(id, suffix);

      dispatch(shopItemDuplicateActions.success(response.data));
      dispatch(snackbarSuccess('shop.item.duplicate.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(snackbarError('shop.item.duplicate.error'));
      dispatch(shopItemDuplicateActions.error(e));
      if (options && options.onError) {
        options.onError(e);
      }
    }

    dispatch(shopItemDuplicateActions.isLoading(false));
  };
}

export const shopItemDeleteActions = {
  isLoading: createAction('SHOPITEM/DELETE/LOADING'),
  error: createAction('SHOPITEM/DELETE/ERROR'),
  success: createAction('SHOPITEM/DELETE/SUCCESS'),
};

export function deleteItem(id: number, callback: ?() => void) {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemDeleteActions.isLoading(true));
    dispatch(shopItemDeleteActions.error(null));

    try {
      const response = await api.deleteItem(id);

      if (
        response.status === 201 ||
        response.status === 200 ||
        response.status === 204
      ) {
        dispatch(shopItemDeleteActions.success(id));
        dispatch(snackbarSuccess('shop.item.delete.success'));
        if (typeof callback === 'function') {
          callback();
        }
      } else {
        dispatch(snackbarError('shop.item.delete.error'));
        dispatch(shopItemDeleteActions.error(response));
      }
    } catch (e) {
      console.error(e);
      dispatch(shopItemDeleteActions.error(e));
      dispatch(snackbarError('shop.item.delete.error'));
    }
    dispatch(shopItemDeleteActions.isLoading(false));
  };
}

export default {
  deleteItem,
  createOrUpdateShopItem,
  fetchShopItem,
  fetchShopItemAsManager,
};
