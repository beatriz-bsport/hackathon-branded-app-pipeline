import { createAction } from 'redux-actions';

import {
  retrieveShopItemList as retrieveShopItemListAPI,
  retrieveShopItemDetails as retrieveShopItemDetailsAPI,
  retrieveShopItemUsedInCombo as retrieveShopItemUsedInComboAPI,
  createShopItem as createShopItemAPI,
  updateShopItem as updateShopItemAPI,
  deleteShopItem as deleteShopItemAPI,
} from '../api';

import type { Dispatch, OptionCallback } from '../../../state/types';
import type {
  IsShopUsedInComboAPI,
  ShopItem,
  ShopItemCreate,
  ShopItemEdit,
  ShopItemListFilterParams,
} from '../types';

export const retrieveShopItemBaseListActions = {
  isLoading: createAction<boolean>('SHOP_ITEM_BASE/LIST/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM_BASE/LIST/ERROR'),
  success: createAction<ShopItem[]>('SHOP_ITEM_BASE/LIST/SUCCESS'),
};

/**
 * Retrieves a list of base shop item. Those items can have variants.
 * @param exclude_variants Exclude all variants created from a base item
 * @param exclude_standalone_items Exclude all standalone items (legacy)
 * @param exclude_base_items Exclude all base items
 */
export const retrieveShopItemBaseList = (
  params: ShopItemListFilterParams,
  options?: OptionCallback<ShopItem[]>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(retrieveShopItemBaseListActions.isLoading(true));
      dispatch(retrieveShopItemBaseListActions.error(null));

      const result = await retrieveShopItemListAPI({
        ...params,
        exclude_variants: true,
        exclude_standalone_items: true,
      });

      dispatch(retrieveShopItemBaseListActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(retrieveShopItemBaseListActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(retrieveShopItemBaseListActions.isLoading(false));
    }
  };
};

export const retrieveShopItemStandaloneListActions = {
  isLoading: createAction<boolean>('SHOP_ITEM_STANDALONE/LIST/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM_STANDALONE/LIST/ERROR'),
  success: createAction<ShopItem[]>('SHOP_ITEM_STANDALONE/LIST/SUCCESS'),
};

/**
 * Retrieves a list of standalone shop item. Those items have no variants.
 * @param exclude_variants Exclude all variants created from a base item
 * @param exclude_standalone_items Exclude all standalone items (legacy)
 * @param exclude_base_items Exclude all base items
 */
export const retrieveShopItemStandaloneList = (
  params: ShopItemListFilterParams,
  options?: OptionCallback<ShopItem[]>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(retrieveShopItemStandaloneListActions.isLoading(true));
      dispatch(retrieveShopItemStandaloneListActions.error(null));

      const result = await retrieveShopItemListAPI({
        ...params,
        exclude_variants: true,
        exclude_base_items: true,
      });

      dispatch(retrieveShopItemStandaloneListActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(retrieveShopItemStandaloneListActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(retrieveShopItemStandaloneListActions.isLoading(false));
    }
  };
};

export const retrieveShopItemDetailsActions = {
  isLoading: createAction<boolean>('SHOP_ITEM/DETAILS/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM/DETAILS/ERROR'),
  success: createAction<ShopItem>('SHOP_ITEM/DETAILS/SUCCESS'),
};

/**
 * Retrieves a base/standalone item.
 * @param id The ID of the shop item
 */
export const retrieveShopItemDetails = (
  id: number,
  options?: OptionCallback<ShopItem>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(retrieveShopItemDetailsActions.isLoading(true));
      dispatch(retrieveShopItemDetailsActions.error(null));

      const result = await retrieveShopItemDetailsAPI(id);

      dispatch(retrieveShopItemDetailsActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(retrieveShopItemDetailsActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(retrieveShopItemDetailsActions.isLoading(false));
    }
  };
};

export const retrieveShopItemUsedInComboActions = {
  isLoading: createAction<boolean>('SHOP_ITEM/USED_IN_COMBO/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM/USED_IN_COMBO/ERROR'),
  success: createAction<IsShopUsedInComboAPI>(
    'SHOP_ITEM/USED_IN_COMBO/SUCCESS',
  ),
};

/**
 * Checks whether the current item is used in any payment combo
 * @param id The ID of the shop item
 */
export const retrieveShopItemUsedInCombo = (
  id: number,
  options?: OptionCallback<IsShopUsedInComboAPI>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(retrieveShopItemUsedInComboActions.isLoading(true));
      dispatch(retrieveShopItemUsedInComboActions.error(null));

      const result = await retrieveShopItemUsedInComboAPI(id);

      dispatch(retrieveShopItemUsedInComboActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(retrieveShopItemUsedInComboActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(retrieveShopItemUsedInComboActions.isLoading(false));
    }
  };
};

export const createShopItemActions = {
  isLoading: createAction<boolean>('SHOP_ITEM/CREATE/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM/CREATE/ERROR'),
  success: createAction<ShopItem>('SHOP_ITEM/CREATE/LIST/SUCCESS'),
};

/**
 * Creates a base item. If variant attributes are provided, items will be created.
 * @param formData The data from fields for the creation
 */
export const createShopItem = (
  formData: ShopItemCreate,
  options?: OptionCallback<ShopItem>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(createShopItemActions.isLoading(true));
      dispatch(createShopItemActions.error(null));

      const result = await createShopItemAPI(formData);

      dispatch(createShopItemActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(createShopItemActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(createShopItemActions.isLoading(false));
    }
  };
};

export const updateShopItemActions = {
  isLoading: createAction<boolean>('SHOP_ITEM/UPDATE/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM/UPDATE/ERROR'),
  success: createAction<ShopItem>('SHOP_ITEM/UPDATE/SUCCESS'),
};

/**
 * Updates a base/standalone shop item.\
 * Params are all existing variant attributes
 * @param id The ID of the shop item to update
 * @param formData The fields to update
 */
export const updateShopItem = ({
  id,
  formData,
  options,
}: {
  id: number;
  formData: ShopItemEdit;
  options: OptionCallback<ShopItem>;
}) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(updateShopItemActions.isLoading(true));
      dispatch(updateShopItemActions.error(null));

      const result = await updateShopItemAPI(id, formData);

      dispatch(updateShopItemActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(updateShopItemActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(updateShopItemActions.isLoading(false));
    }
  };
};

export const deleteShopItemActions = {
  isLoading: createAction<boolean>('SHOP_ITEM/DELETE/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM/DELETE/ERROR'),
  success: createAction<number>('SHOP_ITEM/DELETE/SUCCESS'),
};

/**
 * Deletes a base/standalone shop item.\
 * If deleting a base product all related variants will be disabled
 * @param id The ID of the shop item to delete
 */
export const deleteShopItem = (
  id: number,
  options?: OptionCallback<number>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(deleteShopItemActions.isLoading(true));
      dispatch(deleteShopItemActions.error(null));

      const result = await deleteShopItemAPI(id);

      dispatch(deleteShopItemActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(deleteShopItemActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(deleteShopItemActions.isLoading(false));
    }
  };
};
