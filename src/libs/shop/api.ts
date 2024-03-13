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
  ShopSupplier,
  ProvisionBulkCreate,
  ShopSupplierCreate,
  ShopSupplierUpdate,
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
 * Fetch a list of shop item. Filters available to exclude items based on type.
 * @param is_variant Include all variants created from a base item
 * @param is_base_item Include all base items
 * @param is_standalone_item Include all standalone items
 */
export const fetchShopItemList = (params?: ShopItemListFilterParams) => {
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
export const fetchShopItemVariantList = (
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
export const createShopItem = (formData: FormData) => {
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
 * Duplicates an existing shop item
 * @param id The ID of the shop item to duplicate
 * @param suffix The string to concat at the end of the name of the duplicated item
 */
export const duplicateShopItem = (id: number, suffix: string) => {
  return postAuth<ShopItem>(`${API_V1_URI}/shop/item/${id}/duplicate/`, {
    suffix,
  });
};

/**
 * Retrieves a specific shop item supplier.
 * @param id The ID of the supplier to fetch
 */
export const retrieveShopItemSupplier = (id: number) => {
  return getAuth<ShopSupplier>(`${API_V1_URI}/shop/supplier/${id}`);
};

/**
 * Fetch the list of all shop suppliers
 */
export const fetchShopSupplierList = () => {
  return getAuth<PaginatedResponse<ShopSupplier>>(
    `${API_V1_URI}/shop/supplier/`,
  );
};

/**
 * Creates a new shop supplier
 * @param data The payload sent to the API
 */
export const createShopSupplier = (data: ShopSupplierCreate) => {
  return postAuth<ShopSupplier>(`${API_V1_URI}/shop/supplier/`, data);
};

/**
 * Updates a new shop supplier
 * @param data The payload sent to the API
 */
export const updateShopSupplier = (data: ShopSupplierUpdate) => {
  return patchAuth<ShopSupplier>(`${API_V1_URI}/shop/supplier/${data.id}/`, {
    name: data.name,
    description: data.description,
  });
};

/**
 * Deletes a new shop supplier
 * @param id The ID of the supplier to delete
 */
export const deleteShopSupplier = (id: number) => {
  return deleteAuth(`${API_V1_URI}/shop/supplier/${id}`);
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

/**
 * Fetch the list of all subshops from a company
 * @param company The company ID
 */
export const fetchSubshopList = (params: { company: number }) => {
  return getAuth<SubShop[]>(
    `${API_V1_URI}/shop/subshop/${buildUrlParams(params)}`,
  );
};

/**
 * Creates a new company subshop
 * @param data Object containing the name of the new subshop
 */
export const createSubshop = (data: { name: string }) => {
  return postAuth<SubShop>(`${API_V1_URI}/shop/subshop/`, data);
};

/**
 * Updates an existing company subshop
 * @param data Object containing the ID + name of existing subshop
 */
export const updateSubshop = (data: { id: number; name: string }) => {
  return patchAuth<SubShop>(`${API_V1_URI}/shop/subshop/${data.id}/`, data);
};

/**
 * Deletes an existing company subshop
 * @param id The ID of the subshop to delete
 */
export const deleteSubshop = (id: number) => {
  return deleteAuth(`${API_V1_URI}/shop/subshop/${id}/`);
};
