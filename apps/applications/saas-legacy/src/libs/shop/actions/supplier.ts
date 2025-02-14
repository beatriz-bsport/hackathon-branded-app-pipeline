import { createAction } from 'redux-actions';

import { snackbarError, snackbarSuccess } from '#src/libs/snackbar/actions';

import type {
  ShopSupplier,
  ShopSupplierCreate,
  ShopSupplierTemplate,
  ShopSupplierTemplateCreate,
  ShopSupplierUpdate,
} from '#src/libs/shop/types';
import type { PaginationFilterParams } from '#src/libs/types';
import type {
  Dispatch,
  OptionCallback,
  PaginatedResponse,
} from '../../../state/types';
import {
  retrieveShopItemSupplier as retrieveShopItemSupplierAPI,
  fetchShopSupplierList as retrieveShopSupplierListAPI,
  createShopSupplier as createShopSupplierAPI,
  updateShopSupplier as updateShopSupplierAPI,
  deleteShopSupplier as deleteShopSupplierAPI,
  fetchShopSupplierTemplateList as fetchShopSupplierTemplateListAPI,
  createShopSupplierTemplate as createShopSupplierTemplateAPI,
  updateShopSupplierTemplate as updateShopSupplierTemplateAPI,
  deleteShopSupplierTemplate as deleteShopSupplierTemplateAPI,
} from '../api';

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
  page_size?: number,
  options?: OptionCallback<ShopSupplier[]>,
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const supplierStatePage =
      getState().shopReworked.shopItemReworked.suppliers.page ?? 1;
    try {
      dispatch(fetchShopSupplierListActions.isLoading(true));
      dispatch(fetchShopSupplierListActions.error(null));

      const result = await retrieveShopSupplierListAPI({
        page_size: page_size ?? SHOP_SUPPLIER_PAGE_SIZE,
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

export const fetchShopSupplierTemplateListActions = {
  isLoading: createAction<boolean>('SHOP_SUPPLIER_TEMPLATE/LIST/LOADING'),
  error: createAction<Error | null>('SHOP_SUPPLIER_TEMPLATE/LIST/ERROR'),
  success: createAction<PaginatedResponse<ShopSupplierTemplate>>(
    'SHOP_SUPPLIER_TEMPLATE/LIST/SUCCESS',
  ),
};

/**
 * Fetch the list of all shop supplier templates
 * @param params Default pagination params {@link PaginationFilterParams}
 */
export const fetchShopSupplierTemplateList = (
  params: PaginationFilterParams,
  options?: OptionCallback<PaginatedResponse<ShopSupplierTemplate>>,
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const supplierStatePage =
      getState().shopReworked.shopTemplates.supplierTemplate.page ?? 1;
    try {
      dispatch(fetchShopSupplierTemplateListActions.isLoading(true));
      dispatch(fetchShopSupplierTemplateListActions.error(null));

      const response = await fetchShopSupplierTemplateListAPI({
        page: params?.page ?? supplierStatePage,
        page_size: SHOP_SUPPLIER_PAGE_SIZE,
      });

      dispatch(fetchShopSupplierTemplateListActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(fetchShopSupplierTemplateListActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(fetchShopSupplierTemplateListActions.isLoading(false));
    }
  };
};

export const createShopSupplierTemplateActions = {
  isLoading: createAction<boolean>('SHOP_SUPPLIER_TEMPLATE/CREATE/LOADING'),
  error: createAction<Error | null>('SHOP_SUPPLIER_TEMPLATE/CREATE/ERROR'),
};

/**
 * Creates a new shop supplier template
 * @param data The payload sent to the API
 */
export const createShopSupplierTemplate = (
  data: ShopSupplierTemplateCreate,
  options?: OptionCallback<ShopSupplierTemplate>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(createShopSupplierTemplateActions.isLoading(true));
      dispatch(createShopSupplierTemplateActions.error(null));

      const result = await createShopSupplierTemplateAPI(data);

      dispatch(snackbarSuccess('shop.supplier.create.success'));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(createShopSupplierTemplateActions.error(error));
      dispatch(snackbarError('shop.supplier.create.error'));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(createShopSupplierTemplateActions.isLoading(false));
    }
  };
};

export const updateShopSupplierTemplateActions = {
  isLoading: createAction<boolean>('SHOP_SUPPLIER_TEMPLATE/UPDATE/LOADING'),
  error: createAction<Error | null>('SHOP_SUPPLIER_TEMPLATE/UPDATE/ERROR'),
};

/**
 * Updates an existing shop supplier template
 * @param data The payload sent to the API
 */
export const updateShopSupplierTemplate = (
  data: ShopSupplierUpdate,
  options?: OptionCallback<ShopSupplierTemplate>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(updateShopSupplierTemplateActions.isLoading(true));
      dispatch(updateShopSupplierTemplateActions.error(null));

      const result = await updateShopSupplierTemplateAPI(data);

      dispatch(snackbarSuccess('shop.supplier.update.success'));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(updateShopSupplierTemplateActions.error(error));
      dispatch(snackbarError('shop.supplier.update.error'));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(updateShopSupplierTemplateActions.isLoading(false));
    }
  };
};
export const deleteShopSupplierTemplateActions = {
  isLoading: createAction<boolean>('SHOP_SUPPLIER_TEMPLATE/DELETE/LOADING'),
  error: createAction<Error | null>('SHOP_SUPPLIER_TEMPLATE/DELETE/ERROR'),
};

/**
 * Deletes an existing shop supplier template
 * @param id The ID of the supplier template to delete
 */
export const deleteShopSupplierTemplate = (
  id: number,
  options?: OptionCallback<number>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(deleteShopSupplierTemplateActions.isLoading(true));
      dispatch(deleteShopSupplierTemplateActions.error(null));

      await deleteShopSupplierTemplateAPI(id);

      dispatch(snackbarSuccess('shop.supplier.delete.success'));
      options?.onSuccess?.(id);
    } catch (error) {
      dispatch(deleteShopSupplierTemplateActions.error(error));
      dispatch(snackbarError('shop.supplier.delete.error'));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(deleteShopSupplierTemplateActions.isLoading(false));
    }
  };
};
