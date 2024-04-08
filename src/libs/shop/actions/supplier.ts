import { createAction } from 'redux-actions';

import {
  retrieveShopItemSupplier as retrieveShopItemSupplierAPI,
  fetchShopSupplierList as retrieveShopSupplierListAPI,
  createShopSupplier as createShopSupplierAPI,
  updateShopSupplier as updateShopSupplierAPI,
  deleteShopSupplier as deleteShopSupplierAPI,
} from '../api';

import { snackbarError, snackbarSuccess } from '#libs/snackbar/actions';

import type {
  ShopSupplier,
  ShopSupplierCreate,
  ShopSupplierUpdate,
} from '#libs/shop/types';
import type {
  Dispatch,
  OptionCallback,
  PaginatedResponse,
} from '../../../state/types';
import type { RootState } from '../../../reducers';
import { SHOP_SUPPLIER_PAGE_SIZE } from '../constants';

export const retrieveShopItemSupplierActions = {
  isLoading: createAction<boolean>('SHOP_ITEM/SUPPLIER/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM/SUPPLIER/ERROR'),
  success: createAction<ShopSupplier>('SHOP_ITEM/SUPPLIER/SUCCESS'),
};

/**
 * Retrieves a specific shop item supplier.
 * @param id The ID of the supplier to fetch
 */
export const retrieveShopItemSupplier = (
  id: number,
  options?: OptionCallback<ShopSupplier>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(retrieveShopItemSupplierActions.isLoading(true));
      dispatch(retrieveShopItemSupplierActions.error(null));

      const result = await retrieveShopItemSupplierAPI(id);

      dispatch(retrieveShopItemSupplierActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(retrieveShopItemSupplierActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(retrieveShopItemSupplierActions.isLoading(false));
    }
  };
};

export const fetchShopSupplierListActions = {
  isLoading: createAction<boolean>('SHOP_SUPPLIER/LIST/LOADING'),
  error: createAction<Error | null>('SHOP_SUPPLIER/LIST/ERROR'),
  success: createAction<PaginatedResponse<ShopSupplier>>(
    'SHOP_SUPPLIER/LIST/SUCCESS',
  ),
};

/**
 * Fetch the list of all shop suppliers
 * @param page The page number used to fetch suppliers
 */
export const fetchShopSupplierList = (
  page?: number,
  options?: OptionCallback<ShopSupplier[]>,
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const supplierStatePage =
      getState().shopReworked.shopItemReworked.suppliers.page ?? 1;
    try {
      dispatch(fetchShopSupplierListActions.isLoading(true));
      dispatch(fetchShopSupplierListActions.error(null));

      const result = await retrieveShopSupplierListAPI({
        page_size: SHOP_SUPPLIER_PAGE_SIZE,
        page: page ?? supplierStatePage,
      });

      dispatch(fetchShopSupplierListActions.success(result.data));
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

      dispatch(snackbarSuccess('shop.supplier.create.success'));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(createShopSupplierActions.error(error));
      dispatch(snackbarError('shop.supplier.create.error'));
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

      dispatch(snackbarSuccess('shop.supplier.update.success'));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(updateShopSupplierActions.error(error));
      dispatch(snackbarError('shop.supplier.update.error'));
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

      dispatch(snackbarSuccess('shop.supplier.delete.success'));
      options?.onSuccess?.(id);
    } catch (error) {
      dispatch(deleteShopSupplierActions.error(error));
      dispatch(snackbarError('shop.supplier.delete.error'));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(deleteShopSupplierActions.isLoading(false));
    }
  };
};
