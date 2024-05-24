import { createAction } from 'redux-actions';

import {
  fetchShopItemList as retrieveShopItemListAPI,
  retrieveShopItemDetails as retrieveShopItemDetailsAPI,
  retrieveShopItemUsedInCombo as retrieveShopItemUsedInComboAPI,
  fetchShopItemVariantList as fetchShopItemVariantListAPI,
  createShopItem as createShopItemAPI,
  createShopItemVariants as createShopItemVariantsAPI,
  updateShopItem as updateShopItemAPI,
  updateShopItemVariantBulk as updateShopItemVariantBulkAPI,
  deleteShopItem as deleteShopItemAPI,
  createShopItemProvisionBulk as createShopItemProvisionBulkAPI,
  createShopItemProvision as createShopItemProvisionAPI,
  duplicateShopItem as duplicateShopItemAPI,
  fetchShopItemVariantCombinationList as fetchShopItemVariantCombinationListAPI,
  fetchShopItemTemplateList as fetchShopItemTemplateListAPI,
  retrieveShopItemTemplate as retrieveShopItemTemplateAPI,
  createShopItemTemplate as createShopItemTemplateAPI,
  updateShopItemTemplate as updateShopItemTemplateAPI,
  deleteShopItemTemplate as deleteShopItemTemplateAPI,
} from '../api';

import { snackbarError, snackbarSuccess } from '#libs/snackbar/actions';

import { isErrorWithCustomCode } from '#libs/utils';

import type {
  Dispatch,
  OptionCallback,
  PaginatedResponse,
} from '../../../state/types';
import type {
  IsShopUsedInComboAPI,
  ShopItem,
  ShopItemEdit,
  ShopItemListFilterParams,
  ShopItemVariantAttributes,
  Provision,
  ProvisionBulkCreate,
  ProvisionCreate,
  ShopItemVariantCombination,
  ShopItemTemplate,
  ShopItemTemplateFilterParams,
} from '../types';
import {
  SHOP_ITEM_VARIANTS_PAGE_SIZE,
  SHOP_ITEM_TEMPLATE_PAGE_SIZE,
} from '#libs/shop/constants';
import type { RootState } from '#src/reducers';
import type { PaginationFilterParams } from '#src/libs/types';

export const fetchShopItemBaseListActions = {
  isLoading: createAction<boolean>('SHOP_ITEM_BASE/LIST/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM_BASE/LIST/ERROR'),
  success: createAction<ShopItem[]>('SHOP_ITEM_BASE/LIST/SUCCESS'),
};

/**
 * Fetch a list of base shop item. Those items can have variants.
 * @param is_variant Include all variants created from a base item
 * @param is_base_item Include all base items
 * @param is_standalone_item Include all standalone items
 */
export const fetchShopItemBaseList = (
  params?: ShopItemListFilterParams,
  options?: OptionCallback<ShopItem[]>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(fetchShopItemBaseListActions.isLoading(true));
      dispatch(fetchShopItemBaseListActions.error(null));

      const result = await retrieveShopItemListAPI({
        ...params,
        is_variant: false,
        is_base_item: true,
        is_standalone_item: false,
      });

      dispatch(fetchShopItemBaseListActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(fetchShopItemBaseListActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(fetchShopItemBaseListActions.isLoading(false));
    }
  };
};

export const fetchShopItemStandaloneListActions = {
  isLoading: createAction<boolean>('SHOP_ITEM_STANDALONE/LIST/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM_STANDALONE/LIST/ERROR'),
  success: createAction<ShopItem[]>('SHOP_ITEM_STANDALONE/LIST/SUCCESS'),
};

/**
 * Fetch a list of standalone shop item. Those items have no variants.
 * @param is_variant Include all variants created from a base item
 * @param is_base_item Include all base items
 * @param is_standalone_item Include all standalone items
 */
export const fetchShopItemStandaloneList = (
  params?: ShopItemListFilterParams,
  options?: OptionCallback<ShopItem[]>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(fetchShopItemStandaloneListActions.isLoading(true));
      dispatch(fetchShopItemStandaloneListActions.error(null));

      const result = await retrieveShopItemListAPI({
        ...params,
        is_variant: false,
        is_base_item: false,
        is_standalone_item: true,
      });

      dispatch(fetchShopItemStandaloneListActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(fetchShopItemStandaloneListActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(fetchShopItemStandaloneListActions.isLoading(false));
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
    data: PaginatedResponse<ShopItem>;
    baseItemId: number;
  }>('SHOP_ITEM/VARIANT/LIST/SUCCESS'),
};

/**
 * Fetch all variants related to a base item.\
 * If there are no variants API will return an empty list
 * @param id The ID of the base item
 * @param page The page to fetch
 * @param colors An optional array of string for filtering
 * @param sizes An optional array of string for filtering
 */
export const fetchShopItemVariantList = ({
  id,
  page,
  colors,
  sizes,
  options,
}: PaginationFilterParams & {
  id: number;
  colors?: string[];
  sizes?: string[];
  options?: OptionCallback<PaginatedResponse<ShopItem>>;
}) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(fetchShopItemVariantListActions.isLoading(true));
      dispatch(fetchShopItemVariantListActions.error(null));

      // parse as string for HTTP GET filter
      const colorFilter = colors?.length ? { color: colors.join(',') } : {};
      const sizeFilter = sizes?.length ? { size: sizes.join(',') } : {};

      const result = await fetchShopItemVariantListAPI({
        base_item_id: id,
        page_size: SHOP_ITEM_VARIANTS_PAGE_SIZE,
        page,
        ...colorFilter,
        ...sizeFilter,
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
  formData: FormData,
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
  success: createAction<ShopItem[]>('SHOP_ITEM/VARIANT/CREATE/LIST/SUCCESS'),
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
  options?: OptionCallback<ShopItem[]>;
}) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(createShopItemVariantsActions.isLoading(true));
      dispatch(createShopItemVariantsActions.error(null));

      const result = await createShopItemVariantsAPI(id, data);

      dispatch(createShopItemVariantsActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      if (isErrorWithCustomCode(error)) {
        dispatch(
          snackbarError(
            `shop.variant.error.${error.response.data?.error_code}`,
          ),
        );
      }
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

export const createShopItemProvisionActions = {
  isLoading: createAction<boolean>('SHOP_ITEM/PROVISION/UPDATE/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM/PROVISION/UPDATE/ERROR'),
};

/**
 * Creates a `Provision` object to update stock quantity of a shop item
 * @param data Provision creation payload
 */
export const createShopItemProvision = (
  data: ProvisionCreate,
  options?: OptionCallback<Provision>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(createShopItemProvisionActions.isLoading(true));
      dispatch(createShopItemProvisionActions.error(null));

      const result = await createShopItemProvisionAPI(data);

      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(createShopItemProvisionActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(createShopItemProvisionActions.isLoading(false));
    }
  };
};

export const createShopItemProvisionBulkActions = {
  isLoading: createAction<boolean>('SHOP_ITEM/PROVISION/BULK/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM/PROVISION/BULK/ERROR'),
};

/**
 * Creates several `Provision` objects to update stock
 * quantity of multiple shop items at once
 * @param data Provision creation payload
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

export const duplicateShopItemActions = {
  isLoading: createAction<boolean>('SHOP_ITEM/DUPLICATE/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM/DUPLICATE/ERROR'),
  success: createAction<ShopItem>('SHOP_ITEM/DUPLICATE/SUCCESS'),
};

/**
 * Duplicates an existing shop item
 * @param id The ID of the shop item to duplicate
 * @param suffix The string to concat at the end of the name of the duplicated item
 */
export const duplicateShopItem = (
  id: number,
  suffix: string,
  options?: OptionCallback<ShopItem>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(duplicateShopItemActions.isLoading(true));
      dispatch(duplicateShopItemActions.error(null));

      const result = await duplicateShopItemAPI(id, suffix);

      dispatch(duplicateShopItemActions.success(result.data));
      dispatch(snackbarSuccess('shop.item.duplicate.success'));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(duplicateShopItemActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(duplicateShopItemActions.isLoading(false));
    }
  };
};

export const fetchShopItemVariantCombinationListActions = {
  isLoading: createAction<boolean>(
    'SHOP_ITEM/VARIANT_COMBINATION_LIST/LOADING',
  ),
  error: createAction<Error | null>('SHOP_ITEM/VARIANT_COMBINATION_LIST/ERROR'),
  success: createAction<{ id: number; data: ShopItemVariantCombination[] }>(
    'SHOP_ITEM/VARIANT_COMBINATION_LIST/SUCCESS',
  ),
};

/**
 * Fetch the list of existing variant combination for a base item
 * @param id The ID of the base item
 */
export const fetchShopItemVariantCombinationList = (
  id: number,
  options?: OptionCallback<ShopItemVariantCombination[]>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(fetchShopItemVariantCombinationListActions.isLoading(true));
      dispatch(fetchShopItemVariantCombinationListActions.error(null));

      const result = await fetchShopItemVariantCombinationListAPI(id);

      dispatch(
        fetchShopItemVariantCombinationListActions.success({
          id,
          data: result.data,
        }),
      );
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(fetchShopItemVariantCombinationListActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(fetchShopItemVariantCombinationListActions.isLoading(false));
    }
  };
};

export const fetchShopItemTemplateListActions = {
  isLoading: createAction<{ subshopTemplateId: number; isLoading?: boolean }>(
    'SHOP_ITEM_TEMPLATE/LIST/LOADING',
  ),
  error: createAction<{ subshopTemplateId: number; error: Error | null }>(
    'SHOP_ITEM_TEMPLATE/LIST/ERROR',
  ),
  success: createAction<{
    subshopTemplateId: number;
    data: PaginatedResponse<ShopItemTemplate>;
  }>('SHOP_ITEM_TEMPLATE/LIST/SUCCESS'),
};

/**
 * Fetch the list of existing shop item templates
 * @param params An object containing the pagination and required property `subshops` {@link ShopItemTemplateFilterParams}
 */
export const fetchShopItemTemplateList = (
  params: ShopItemTemplateFilterParams,
  options?: OptionCallback<PaginatedResponse<ShopItemTemplate>>,
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const page =
      params.page ??
      getState().shopReworked.shopTemplates.shopItemTemplate
        .bySubshopTemplateId[params.sub_shop_template]?.page ??
      1;
    try {
      dispatch(
        fetchShopItemTemplateListActions.isLoading({
          subshopTemplateId: params.sub_shop_template,
          isLoading: true,
        }),
      );
      dispatch(
        fetchShopItemTemplateListActions.error({
          subshopTemplateId: params.sub_shop_template,
          error: null,
        }),
      );

      const response = await fetchShopItemTemplateListAPI({
        ...params,
        page_size: SHOP_ITEM_TEMPLATE_PAGE_SIZE,
        page,
      });

      dispatch(
        fetchShopItemTemplateListActions.success({
          subshopTemplateId: params.sub_shop_template,
          data: response.data,
        }),
      );
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(
        fetchShopItemTemplateListActions.error({
          subshopTemplateId: params.sub_shop_template,
          error,
        }),
      );
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(
        fetchShopItemTemplateListActions.isLoading({
          subshopTemplateId: params.sub_shop_template,
          isLoading: false,
        }),
      );
    }
  };
};

export const retrieveShopItemTemplateDetailsActions = {
  isLoading: createAction<boolean>('SHOP_ITEM_TEMPLATE/DETAILS/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM_TEMPLATE/DETAILS/ERROR'),
  success: createAction<ShopItemTemplate>('SHOP_ITEM_TEMPLATE/DETAILS/SUCCESS'),
};

/**
 * Retrieves a base/standalone item template
 * @param id The ID of the shop item template
 */
export const retrieveShopItemTemplate = (
  id: number,
  options?: OptionCallback<ShopItemTemplate>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(retrieveShopItemTemplateDetailsActions.isLoading(true));
      dispatch(retrieveShopItemTemplateDetailsActions.error(null));

      const result = await retrieveShopItemTemplateAPI(id);

      dispatch(retrieveShopItemTemplateDetailsActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(retrieveShopItemTemplateDetailsActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(retrieveShopItemTemplateDetailsActions.isLoading(false));
    }
  };
};

export const createShopItemTemplateActions = {
  isLoading: createAction<boolean>('SHOP_ITEM_TEMPLATE/CREATE/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM_TEMPLATE/CREATE/ERROR'),
};

/**
 * Creates a new shop item template. Creates shop item variants template if variant properties are detected (async task).
 * @param data Form data containing shop item properties and required `sub_shop_template` in addition to `company_ids[n]`
 */
export const createShopItemTemplate = (
  data: FormData,
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(createShopItemTemplateActions.isLoading(true));
      dispatch(createShopItemTemplateActions.error(null));

      await createShopItemTemplateAPI(data);

      options?.onSuccess?.();
    } catch (error) {
      dispatch(createShopItemTemplateActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(createShopItemTemplateActions.isLoading(false));
    }
  };
};

export const updateShopItemTemplateActions = {
  isLoading: createAction<boolean>('SHOP_ITEM_TEMPLATE/UPDATE/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM_TEMPLATE/UPDATE/ERROR'),
};

/**
 * Updates an existing shop item template. If shop item variants templates exist, they will also be updated (async task).
 * @param data Form data containing the updated fields of the shop item template
 */
export const updateShopItemTemplate = ({
  formData,
  id,
  options,
}: {
  formData: FormData;
  id: number;
  options?: OptionCallback;
}) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(updateShopItemTemplateActions.isLoading(true));
      dispatch(updateShopItemTemplateActions.error(null));

      await updateShopItemTemplateAPI(id, formData);

      options?.onSuccess?.();
    } catch (error) {
      dispatch(updateShopItemTemplateActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(updateShopItemTemplateActions.isLoading(false));
    }
  };
};

export const deleteShopItemTemplateActions = {
  isLoading: createAction<boolean>('SHOP_ITEM_TEMPLATE/DELETE/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM_TEMPLATE/DELETE/ERROR'),
};

/**
 * Deletes an existing shop item template
 * @param id The ID of the shop item template to delete
 */
export const deleteShopItemTemplate = (
  id: number,
  options?: OptionCallback<number>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(deleteShopItemTemplateActions.isLoading(true));
      dispatch(deleteShopItemTemplateActions.error(null));

      await deleteShopItemTemplateAPI(id);

      options?.onSuccess?.(id);
    } catch (error) {
      dispatch(deleteShopItemTemplateActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(deleteShopItemTemplateActions.isLoading(false));
    }
  };
};

export const fetchShopItemTemplateVariantListActions = {
  isLoading: createAction<boolean>('SHOP_ITEM_TEMPLATE/VARIANT/LIST/LOADING'),
  error: createAction<Error | null>('SHOP_ITEM_TEMPLATE/VARIANT/LIST/ERROR'),
  success: createAction<{
    data: PaginatedResponse<ShopItem>;
    baseItemTemplateId: number;
  }>('SHOP_ITEM_TEMPLATE/VARIANT/LIST/SUCCESS'),
};

/**
 * Fetch all variants related to a base item template.\
 * If there are no variants API will return an empty list
 * @param id The ID of the base item template
 * @param colors An optional array of string for filtering
 * @param sizes An optional array of string for filtering
 */
export const fetchShopItemTemplateVariantList = ({
  id,
  page,
  colors,
  sizes,
  options,
}: PaginationFilterParams & {
  id: number;
  colors?: string[];
  sizes?: string[];
  options?: OptionCallback<PaginatedResponse<ShopItem>>;
}) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(fetchShopItemTemplateVariantListActions.isLoading(true));
      dispatch(fetchShopItemTemplateVariantListActions.error(null));

      // parse as string for HTTP GET filter
      const colorFilter = colors?.length ? { color: colors.join(',') } : {};
      const sizeFilter = sizes?.length ? { size: sizes.join(',') } : {};

      const result = await fetchShopItemVariantListAPI({
        base_shop_item_template: id,
        page_size: SHOP_ITEM_VARIANTS_PAGE_SIZE,
        page,
        is_variant: true,
        ...colorFilter,
        ...sizeFilter,
      });

      dispatch(
        fetchShopItemTemplateVariantListActions.success({
          data: result.data,
          baseItemTemplateId: id,
        }),
      );
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(fetchShopItemTemplateVariantListActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(fetchShopItemTemplateVariantListActions.isLoading(false));
    }
  };
};
