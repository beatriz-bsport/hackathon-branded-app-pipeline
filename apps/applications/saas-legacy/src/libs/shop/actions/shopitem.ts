import { createAction } from 'redux-actions';

import { AxiosResponse } from 'axios';
import uniq from 'lodash/uniq';
import { snackbarSuccess, snackbarError } from '#src/libs/snackbar/actions';
import {
  fetchAll,
  fetchOld,
  fetchShopItem as fetchShopItemAPI,
  deleteItem as deleteItemAPI,
  duplicateItem,
  isShopItemUsedInCombo as isShopItemUsedInComboAPI,
  updateItem,
  createItem,
} from '../api';

import type { Dispatch, OptionCallback, State } from '#src/state/types';
import type {
  IsShopUsedInComboAPI,
  ShopItem,
  ShopItemCreate,
  ShopItemEdit,
} from '#src/libs/shop/types';
import { getFreshShopIds } from '../selectors';

export const shopItemAsConsumerActions = {
  isLoading: createAction<boolean>('SHOPITEM/AS_CONSUMER/LOADING'),
  error: createAction<Error | null>('SHOPITEM/AS_CONSUMER/ERROR'),
  success: createAction<ShopItem[]>('SHOPITEM/AS_CONSUMER/SUCCESS'),
};

export function fetchShopItemAsConsumer(
  company: number,
  options: OptionCallback<ShopItem[]>,
): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemAsConsumerActions.isLoading(true));
    dispatch(shopItemAsConsumerActions.error(null));
    try {
      const response = await fetchAll({
        marketplace_enabled: true,
        disabled: false,
        company,
        as_consumer: true,
        is_base_item: false,
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
    dispatch(shopItemAsConsumerActions.isLoading(false));
  };
}

export const shopItemFeaturedActions = {
  isLoading: createAction<boolean>('SHOPITEM/FEATURED/LOADING'),
  error: createAction<Error | null>('SHOPITEM/FEATURED/ERROR'),
  success: createAction<ShopItem[]>('SHOPITEM/FEATURED/SUCCESS'),
};

export function fetchShopItemFeatured(
  company: number,
  options: OptionCallback<ShopItem[]>,
  page?: number,
  page_size?: number,
): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemFeaturedActions.isLoading(true));
    dispatch(shopItemFeaturedActions.error(null));
    try {
      const response = await fetchAll({
        marketplace_enabled: true,
        featured: true,
        disabled: false,
        company,
        as_consumer: true,
        page,
        page_size,
        is_base_item: false,
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
    dispatch(shopItemFeaturedActions.isLoading(false));
  };
}

export const shopItemAsManagerActions = {
  isLoading: createAction<boolean>('SHOPITEM/AS_MANAGER/LOADING'),
  error: createAction<Error | null>('SHOPITEM/AS_MANAGER/ERROR'),
  success: createAction<ShopItem[]>('SHOPITEM/AS_MANAGER/SUCCESS'),
};

export function fetchShopItemAsManager(
  company?: number,
  options?: OptionCallback<ShopItem[]>,
): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemAsManagerActions.isLoading(true));
    dispatch(shopItemAsManagerActions.error(null));

    try {
      const response = await fetchAll({
        is_base_item: false,
        ...(!!company && { company }),
      });
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
  isLoading: createAction<boolean>('SHOPITEM/BULK/LOADING'),
  error: createAction<Error | null>('SHOPITEM/BULK/ERROR'),
  success: createAction<ShopItem>('SHOPITEM/BULK/SUCCESS'),
};

export function fetchBulk(companyId: number | undefined, ids: number[]) {
  return async (dispatch: Dispatch, getState: () => State) => {
    const freshShopList = getFreshShopIds(getState());
    const ids_uniq = uniq(ids.filter((id: number) => !!id)).filter(
      (id: number) => !freshShopList.includes(id),
    );
    if (ids_uniq.length === 0) {
      return;
    }
    dispatch(shopItemBulkActions.isLoading(true));
    dispatch(shopItemBulkActions.error(null));
    try {
      const response = await fetchOld({
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

export function fetchAllShopItem(
  companyId?: number,
  options?: OptionCallback<ShopItem>,
): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemBulkActions.isLoading(true));
    dispatch(shopItemBulkActions.error(null));
    try {
      const response = companyId
        ? await fetchOld({
            company: companyId,
          })
        : await fetchOld();
      dispatch(shopItemBulkActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (e) {
      dispatch(shopItemBulkActions.error(e));
    }
    dispatch(shopItemBulkActions.isLoading(false));
  };
}

export const shopItemRetrieveActions = {
  isLoading: createAction<boolean>('SHOPITEM/RETRIEVE/LOADING'),
  error: createAction<Error | null>('SHOPITEM/RETRIEVE/ERROR'),
  success: createAction<ShopItem>('SHOPITEM/RETRIEVE/SUCCESS'),
};

export function fetchShopItem(
  id: number,
  options: OptionCallback<ShopItem>,
): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemRetrieveActions.isLoading(true));
    dispatch(shopItemRetrieveActions.error(null));
    try {
      const response = await fetchShopItemAPI(id);
      dispatch(shopItemRetrieveActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      dispatch(snackbarError(`shop.item.notFound`));
      dispatch(shopItemRetrieveActions.error(e));
      console.error(e);
    }
    dispatch(shopItemRetrieveActions.isLoading(false));
  };
}

export const shopItemCreateOrUpdateActions = {
  isLoading: createAction<boolean>('SHOPITEM/CREATE_OR_UPDATE/LOADING'),
  error: createAction<Error | null>('SHOPITEM/CREATE_OR_UPDATE/ERROR'),
  success: createAction<ShopItem>('SHOPITEM/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateShopItem(
  shopItemData: ShopItemCreate | ShopItemEdit,
  id: number | null,
  options: OptionCallback<ShopItem>,
): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemCreateOrUpdateActions.isLoading(true));
    dispatch(shopItemCreateOrUpdateActions.error(null));

    const createOrUpdate: (
      shopItemData: ShopItemCreate | ShopItemEdit,
      id: number | null,
    ) => Promise<AxiosResponse<ShopItem>> = id ? updateItem : createItem;
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
  isLoading: createAction<boolean>('SHOPITEM/DUPLICATE/LOADING'),
  error: createAction<Error | null>('SHOPITEM/DUPLICATE/ERROR'),
  success: createAction<ShopItem>('SHOPITEM/DUPLICATE/SUCCESS'),
};

export function duplicateShopItem(
  id: number,
  suffix: string,
  options: OptionCallback<ShopItem>,
): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemDuplicateActions.isLoading(true));
    dispatch(shopItemDuplicateActions.error(null));

    try {
      const response = await duplicateItem(id, suffix);

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
  isLoading: createAction<boolean>('SHOPITEM/DELETE/LOADING'),
  error: createAction<Error | AxiosResponse<null>>('SHOPITEM/DELETE/ERROR'),
  success: createAction<number>('SHOPITEM/DELETE/SUCCESS'),
};

export function deleteItem(
  id: number,
  callback: () => void,
): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(shopItemDeleteActions.isLoading(true));
    dispatch(shopItemDeleteActions.error(null));

    try {
      const response = await deleteItemAPI(id);

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
        // @ts-expect-error
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

export const isShopItemUsedInComboActions = {
  isLoading: createAction<boolean>('SHOPITEM/COMBO_USE/IS_LOADING'),
  error: createAction<Error | null>('SHOPITEM/COMBO_USE/ERROR'),
  success: createAction<IsShopUsedInComboAPI>('SHOPITEM/COMBO_USE/SUCCESS'),
};

export function isShopItemUsedInCombo(
  id: number,
  options?: OptionCallback<IsShopUsedInComboAPI>,
): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(isShopItemUsedInComboActions.error(null));
    dispatch(isShopItemUsedInComboActions.isLoading(true));
    try {
      const response = await isShopItemUsedInComboAPI(id);
      dispatch(isShopItemUsedInComboActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(isShopItemUsedInComboActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(isShopItemUsedInComboActions.isLoading(false));
  };
}

export default {
  deleteItem,
  createOrUpdateShopItem,
  fetchShopItem,
  fetchShopItemAsManager,
};
