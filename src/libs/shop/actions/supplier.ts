import { createAction } from 'redux-actions';

import {
  fetchShopSupplierList as retrieveShopSupplierListAPI,
  createShopSupplier as createShopSupplierAPI,
  updateShopSupplier as updateShopSupplierAPI,
  deleteShopSupplier as deleteShopSupplierAPI,
} from '../api';

import type {
  ShopSupplier,
  ShopSupplierCreate,
  ShopSupplierUpdate,
} from '#libs/shop/types';
import type { Dispatch, OptionCallback } from '../../../state/types';

export const fetchShopSupplierListActions = {
  isLoading: createAction<boolean>('SHOP_SUPPLIER/LIST/LOADING'),
  error: createAction<Error | null>('SHOP_SUPPLIER/LIST/ERROR'),
  success: createAction<ShopSupplier[]>('SHOP_SUPPLIER/LIST/SUCCESS'),
};

/**
 * Fetch the list of all shop suppliers
 */
export const fetchShopSupplierList = (
  options?: OptionCallback<ShopSupplier[]>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(fetchShopSupplierListActions.isLoading(true));
      dispatch(fetchShopSupplierListActions.error(null));

      const result = await retrieveShopSupplierListAPI();

      dispatch(fetchShopSupplierListActions.success(result.data.results));
      options?.onSuccess?.(result.data.results);
    } catch (error) {
      dispatch(fetchShopSupplierListActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(fetchShopSupplierListActions.isLoading(false));
    }
  };
};

export const createShopSupplierActions = {
  isLoading: createAction<boolean>('SHOP_SUPPLIER/CREATE/LOADING'),
  error: createAction<Error | null>('SHOP_SUPPLIER/CREATE/ERROR'),
  success: createAction<ShopSupplier>('SHOP_SUPPLIER/CREATE/SUCCESS'),
};

/**
 * Creates a new shop supplier
 * @param data The payload sent to the API
 */
export const createShopSupplier = (
  data: ShopSupplierCreate,
  options?: OptionCallback<ShopSupplier>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(createShopSupplierActions.isLoading(true));
      dispatch(createShopSupplierActions.error(null));

      const result = await createShopSupplierAPI(data);

      dispatch(createShopSupplierActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(createShopSupplierActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(createShopSupplierActions.isLoading(false));
    }
  };
};

export const updateShopSupplierActions = {
  isLoading: createAction<boolean>('SHOP_SUPPLIER/UPDATE/LOADING'),
  error: createAction<Error | null>('SHOP_SUPPLIER/UPDATE/ERROR'),
  success: createAction<ShopSupplier>('SHOP_SUPPLIER/UPDATE/SUCCESS'),
};

/**
 * Updates a new shop supplier
 * @param data The payload sent to the API
 */
export const updateShopSupplier = (
  data: ShopSupplierUpdate,
  options?: OptionCallback<ShopSupplier>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(updateShopSupplierActions.isLoading(true));
      dispatch(updateShopSupplierActions.error(null));

      const result = await updateShopSupplierAPI(data);

      dispatch(updateShopSupplierActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(updateShopSupplierActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(updateShopSupplierActions.isLoading(false));
    }
  };
};

export const deleteShopSupplierActions = {
  isLoading: createAction<boolean>('SHOP_SUPPLIER/DELETE/LOADING'),
  error: createAction<Error | null>('SHOP_SUPPLIER/DELETE/ERROR'),
  success: createAction<number>('SHOP_SUPPLIER/DELETE/SUCCESS'),
};

/**
 * Deletes a new shop supplier
 * @param id The ID of the supplier to delete
 */
export const deleteShopSupplier = (
  id: number,
  options?: OptionCallback<number>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(deleteShopSupplierActions.isLoading(true));
      dispatch(deleteShopSupplierActions.error(null));

      await deleteShopSupplierAPI(id);

      dispatch(deleteShopSupplierActions.success(id));
      options?.onSuccess?.(id);
    } catch (error) {
      dispatch(deleteShopSupplierActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(deleteShopSupplierActions.isLoading(false));
    }
  };
};
