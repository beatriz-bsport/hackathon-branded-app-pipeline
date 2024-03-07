import { createAction } from 'redux-actions';

import {
  retrieveShopItemList as retrieveShopItemListAPI,
  retrieveShopItemDetails as retrieveShopItemDetailsAPI,
  retrieveShopItemUsedInCombo as retrieveShopItemUsedInComboAPI,
  retrieveShopItemVariantList as retrieveShopItemVariantListAPI,
  createShopItem as createShopItemAPI,
  createShopItemVariants as createShopItemVariantsAPI,
  updateShopItem as updateShopItemAPI,
  updateShopItemVariantBulk as updateShopItemVariantBulkAPI,
  deleteShopItem as deleteShopItemAPI,
  retrieveShopItemSupplier as retrieveShopItemSupplierAPI,
  createShopItemProvisionBulk as createShopItemProvisionBulkAPI,
} from '../api';

import type {
  Dispatch,
  OptionCallback,
  PaginatedResponse,
} from '../../../state/types';
import type {
  IsShopUsedInComboAPI,
  ShopItem,
  ShopItemCreate,
  ShopItemEdit,
  ShopItemListFilterParams,
  ShopItemVariant,
  ShopItemVariantAttributes,
  ShopSupplier,
  Provision,
  ProvisionBulkCreate,
} from '../types';
import { SHOP_ITEM_VARIANTS_PAGE_SIZE } from '../constants';

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
      console.error(error);
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
      console.error(error);
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
      console.error(error);
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
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(retrieveShopItemUsedInComboActions.isLoading(false));
    }
  };
};

export const fetchShopItemVariantListActions = {
  isLoading: createAction<boolean>('SHOP_ITEM/VARIANT/LIST/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM/VARIANT/LIST/ERROR'),
  success: createAction<{
    data: PaginatedResponse<ShopItemVariant>;
    baseItemId: number;
  }>('SHOP_ITEM/VARIANT/LIST/SUCCESS'),
};

/**
 * Retrieves all variants related to a base item.\
 * If there are no variants API will return an empty list
 * @param id The ID of the base item
 * @param page The page to fetch
 */
export const retrieveShopItemVariantList = ({
  id,
  page,
  options,
}: {
  id: number;
  page?: number;
  options?: OptionCallback<PaginatedResponse<ShopItemVariant>>;
}) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(fetchShopItemVariantListActions.isLoading(true));
      dispatch(fetchShopItemVariantListActions.error(null));

      const result = await retrieveShopItemVariantListAPI({
        base_item_id: id,
        page_size: SHOP_ITEM_VARIANTS_PAGE_SIZE,
        page,
      });

      dispatch(
        fetchShopItemVariantListActions.success({
          data: result.data,
          baseItemId: id,
        }),
      );
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(fetchShopItemVariantListActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(fetchShopItemVariantListActions.isLoading(false));
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
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(createShopItemActions.isLoading(false));
    }
  };
};

export const createShopItemVariantsActions = {
  isLoading: createAction<boolean>('SHOP_ITEM/VARIANT/CREATE/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM/VARIANT/CREATE/ERROR'),
  success: createAction<ShopItemVariant[]>(
    'SHOP_ITEM/VARIANT/CREATE/LIST/SUCCESS',
  ),
};

/**
 * Creates one or more variants for an existing base item.\
 * Params are all existing variant attributes
 * @param id The base item id to create variants from
 * @param color An array of strings
 * @param size An array of strings
 */
export const createShopItemVariants = ({
  id,
  data,
  options,
}: {
  id: number;
  data: ShopItemVariantAttributes;
  options?: OptionCallback<ShopItemVariant[]>;
}) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(createShopItemVariantsActions.isLoading(true));
      dispatch(createShopItemVariantsActions.error(null));

      const result = await createShopItemVariantsAPI(id, data);

      dispatch(createShopItemVariantsActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(createShopItemVariantsActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(createShopItemVariantsActions.isLoading(false));
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
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(updateShopItemActions.isLoading(false));
    }
  };
};

export const updateShopItemVariantBulkActions = {
  isLoading: createAction<boolean>('SHOP_ITEM/VARIANT/UPDATE_BULK/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM/VARIANT/UPDATE_BULK/ERROR'),
  success: createAction('SHOP_ITEM/VARIANT/UPDATE_BULK/SUCCESS'),
};

/**
 * Updates one or multiple shop item variants related to a base item.\
 * Params are all existing variant attributes
 * @param id The ID of the shop item to update
 * @param data The payload sent to the API. Array of variants item fields expected.
 */
export const updateShopItemVariantBulk = ({
  id,
  data,
  options,
}: {
  id: number;
  data: FormData;
  options: OptionCallback;
}) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(updateShopItemVariantBulkActions.isLoading(true));
      dispatch(updateShopItemVariantBulkActions.error(null));

      await updateShopItemVariantBulkAPI(id, data);

      dispatch(updateShopItemVariantBulkActions.success());
      options?.onSuccess?.();
    } catch (error) {
      dispatch(updateShopItemVariantBulkActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(updateShopItemVariantBulkActions.isLoading(false));
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
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(deleteShopItemActions.isLoading(false));
    }
  };
};

export const deleteShopItemVariantActions = {
  isLoading: createAction<boolean>('SHOP_ITEM/VARIANT/DELETE/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM/VARIANT/DELETE/ERROR'),
  success: createAction<number>('SHOP_ITEM/VARIANT/DELETE/SUCCESS'),
};

/**
 * Deletes a single variant shop item.
 * @param id The ID of the shop item variant to delete
 */
export const deleteShopItemVariant = (
  id: number,
  options?: OptionCallback<number>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(deleteShopItemVariantActions.isLoading(true));
      dispatch(deleteShopItemVariantActions.error(null));

      const result = await deleteShopItemAPI(id);

      dispatch(deleteShopItemVariantActions.success(id));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(deleteShopItemVariantActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(deleteShopItemVariantActions.isLoading(false));
    }
  };
};

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

export const createShopItemProvisionBulkActions = {
  isLoading: createAction<boolean>('SHOP_ITEM/PROVISION/BULK/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM/PROVISION/BULK/ERROR'),
};

/**
 * Update the current stock quantity for multiple shop items at once.
 * @param id The base shop item id. Used to update redux store without refetching.
 * @param data Formatted payload from Formik
 */
export const createShopItemProvisionBulk = (
  id: number,
  data: ProvisionBulkCreate,
  options?: OptionCallback<Provision[]>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(createShopItemProvisionBulkActions.isLoading(true));
      dispatch(createShopItemProvisionBulkActions.error(null));

      const result = await createShopItemProvisionBulkAPI(data);

      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(createShopItemProvisionBulkActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(createShopItemProvisionBulkActions.isLoading(false));
    }
  };
};
