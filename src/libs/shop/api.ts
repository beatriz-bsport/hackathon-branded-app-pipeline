import { AxiosResponse } from 'axios';
import {
  API_V1_URI,
  postAuth,
  getAuth,
  patchAuth,
  buildUrlParams,
  deleteAuth,
} from '../../http';

import type { PaginatedResponse } from '../../state/types';
import type {
  IsShopUsedInComboAPI,
  Provision,
  ShopItem,
  ShopAPIFilter,
  SubShop,
  SubShopAPI,
  ProvisionCreate,
  ShopItemCreate,
  ShopItemEdit,
  ShopItemListFilterParams,
  ShopItemVariant,
  ShopItemVariantAttributes,
  ShopItemVariantFilterParams,
  ShopItemSupplier,
  ProvisionBulkCreate,
} from './types';

export async function fetchAll(
  params: ShopAPIFilter,
): Promise<AxiosResponse<ShopItem[]>> {
  return getAuth(`${API_V1_URI}/shop/item/${buildUrlParams(params)}`);
}

export async function fetchOld(params?: {
  company: number;
  id__in?: number[];
}): Promise<AxiosResponse<PaginatedResponse<ShopItem>>> {
  return getAuth(`${API_V1_URI}/shop/item/get_all/${buildUrlParams(params)}`);
}

export async function fetchShopItem(
  id: number,
): Promise<AxiosResponse<ShopItem>> {
  return getAuth(`${API_V1_URI}/shop/item/${id}/`);
}

export async function fetchAllSubShop({
  companyId,
}: {
  companyId?: number;
}): Promise<AxiosResponse<PaginatedResponse<SubShop>>> {
  let queryParams = '';
  if (companyId) {
    queryParams += `?company=${companyId}`;
  }
  return getAuth(`${API_V1_URI}/shop/subshop/${queryParams}`);
}

export async function createItem(
  shopItemData: ShopItemCreate,
): Promise<AxiosResponse<ShopItem>> {
  return postAuth(`${API_V1_URI}/shop/item/`, shopItemData);
}

export async function updateItem(
  shopItemData: ShopItemEdit,
  id: number,
): Promise<AxiosResponse<ShopItem>> {
  return patchAuth(`${API_V1_URI}/shop/item/${id}/`, shopItemData);
}

export async function deleteItem(
  shopItemId: number,
): Promise<AxiosResponse<number>> {
  return deleteAuth(`${API_V1_URI}/shop/item/${shopItemId}/`);
}

export async function duplicateItem(
  shopItemId: number,
  suffix: string,
): Promise<AxiosResponse<ShopItem>> {
  return postAuth(`${API_V1_URI}/shop/item/${shopItemId}/duplicate/`, {
    suffix,
  });
}

export async function createProvision(
  data: Provision | ProvisionCreate,
): Promise<AxiosResponse<Provision>> {
  return postAuth(`${API_V1_URI}/shop/provision/`, data);
}

export async function createSubShop(
  data: SubShop,
): Promise<AxiosResponse<SubShopAPI>> {
  return postAuth(`${API_V1_URI}/shop/subshop/`, { name: data.name });
}

export async function updateSubShop(data: {
  id: number;
  name: string;
}): Promise<AxiosResponse<SubShopAPI>> {
  return patchAuth(`${API_V1_URI}/shop/subshop/${data.id}/`, data);
}

export async function deleteSubShop(
  id: number,
): Promise<AxiosResponse<number>> {
  return deleteAuth(`${API_V1_URI}/shop/subshop/${id}/`);
}

export async function fetchProvisions(
  shopitemId: number,
  page: number,
  page_size: number,
): Promise<AxiosResponse<PaginatedResponse<Provision>>> {
  let urlParams = '';
  if (page && page_size) {
    urlParams = `&page=${page}&page_size=${page_size}`;
  }
  return getAuth(
    `${API_V1_URI}/shop/provision/?shop_item=${shopitemId}${urlParams}`,
  );
}

export async function isShopItemUsedInCombo(
  id: number,
): Promise<AxiosResponse<IsShopUsedInComboAPI>> {
  return postAuth(`${API_V1_URI}/shop/item/${id}/check_archive_side_effects/`);
}

export default {
  fetchAll,
  fetchAllSubShop,
  deleteItem,
  createProvision,
  updateSubShop,
  deleteSubShop,
  fetchShopItem,
  fetchProvisions,
  duplicateItem,
};

/* --- REWORKED --- */

/**
 * Retrieves a list of shop item. Filters available to exclude items based on type.
 * @param exclude_variants Exclude all variants created from a base item
 * @param exclude_standalone_items Exclude all standalone items (legacy)
 * @param exclude_base_items Exclude all base items
 */
export const retrieveShopItemList = (params?: ShopItemListFilterParams) => {
  return getAuth<ShopItem[]>(
    `${API_V1_URI}/shop/item/${buildUrlParams(params)}`,
  );
};

/**
 * Retrieves a base/standalone item.
 * @param id The ID of the shop item
 */
export const retrieveShopItemDetails = (id: number) => {
  return getAuth<ShopItem>(`${API_V1_URI}/shop/item/${id}`);
};

/**
 * Checks whether the current item is used in any payment combo
 * @param id The ID of the shop item
 */
export const retrieveShopItemUsedInCombo = (id: number) => {
  return postAuth<IsShopUsedInComboAPI>(
    `${API_V1_URI}/shop/item/${id}/check_archive_side_effects/`,
  );
};

/**
 * Retrieves all variants related to a base item.\
 * If there are no variants API will return an empty list
 * @param base_item_id The ID of the base item
 */
export const retrieveShopItemVariantList = (
  params: ShopItemVariantFilterParams,
) => {
  return getAuth<PaginatedResponse<ShopItemVariant>>(
    `${API_V1_URI}/shop/item/${buildUrlParams(params)}`,
  );
};

/**
 * Creates a base item. If variant attributes are provided, items will be created.
 * @param formData The data from fields for the creation
 */
export const createShopItem = (formData: ShopItemCreate) => {
  return postAuth<ShopItem>(`${API_V1_URI}/shop/item/`, formData);
};

/**
 * Creates one or more variants for an existing base item.\
 * Params are all existing variant attributes
 * @param id The base item id to create variants from
 * @param color An array of strings
 * @param size An array of strings
 */
export const createShopItemVariants = (
  id: number,
  data: ShopItemVariantAttributes,
) => {
  return postAuth<ShopItemVariant[]>(
    `${API_V1_URI}/shop/item/${id}/variants/`,
    data,
  );
};

/**
 * Updates a base/standalone shop item.\
 * Params are all existing variant attributes
 * @param id The ID of the shop item to update
 * @param formData The fields to update
 */
export const updateShopItem = (id: number, formData: ShopItemEdit) => {
  return patchAuth<ShopItem>(`${API_V1_URI}/shop/item/${id}/`, formData);
};

/**
 * Updates one or multiple shop item variants related to a base item.\
 * Params are all existing variant attributes
 * @param id The ID of the base item
 * @param data The payload sent to the API. Array of variants item fields expected.
 */
export const updateShopItemVariantBulk = (id: number, data: FormData) => {
  /**
   * Response:
   * - 204 on success.
   * - 404 if the base item cannot be found.
   * - 400 if the update couldn't be processed correctly.
   */
  return patchAuth(`${API_V1_URI}/shop/item/${id}/variants/bulk_update/`, data);
};

/**
 * Deletes a base/standalone/variant shop item.\
 * If deleting a base product all related variants will be disabled
 * @param id The ID of the shop item to update
 */
export const deleteShopItem = (id: number) => {
  return deleteAuth<number>(`${API_V1_URI}/shop/item/${id}/`);
};

/**
 * Retrieves a specific shop item supplier.
 * @param id The ID of the supplier to fetch
 */
export const retrieveShopItemSupplier = (id: number) => {
  return getAuth<ShopItemSupplier>(`${API_V1_URI}/shop/supplier/${id}`);
};

/**
 * Update the current stock quantity for multiple shop items at once.
 * @param data Formatted payload from Formik
 */
export const createShopItemProvisionBulk = (data: ProvisionBulkCreate) => {
  return postAuth<Provision[]>(
    `${API_V1_URI}/shop/provision/bulk_create/`,
    data,
  );
};
