import type { AxiosResponse } from 'axios';

import type { PaginationFilterParams } from '#src/libs/types';

import {
  postAuth,
  getAuth,
  patchAuth,
  buildUrlParams,
  deleteAuth,
} from '../../http';

import type { PaginatedResponse } from '#src/state/types';
import type {
  IsShopUsedInComboAPI,
  Provision,
  ShopItem,
  SubShop,
  SubShopAPI,
  ProvisionCreate,
  ShopItemCreate,
  ShopItemEdit,
  ShopItemFilterParams,
  ShopItemVariantAttributes,
  ShopSupplier,
  ProvisionBulkCreate,
  ShopSupplierCreate,
  ShopSupplierUpdate,
  ShopItemVariantCombination,
  SubshopTemplateCreate,
  SubshopTemplate,
  SubshopTemplateUpdate,
  ShopItemTemplate,
  ShopItemTemplateFilterParams,
  ShopSupplierTemplate,
  ShopSupplierTemplateCreate,
  ShopItemBarcodeUnicity,
} from './types';

import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BUYABLE_V1;
/**
 * @deprecated LEGACY - use the reworked API Fn
 * @see {@link fetchShopItemList} */
export async function fetchAll(params: ShopItemFilterParams) {
  return getAuth<ShopItem[]>(
    `${API_V1_URI}/shop/item/${buildUrlParams(params)}`,
  );
}

/**
 * @deprecated LEGACY endpoint with no pagination
 * Do not delete because still in use for reports
 */
export async function fetchOld(
  params?: ShopItemFilterParams & {
    company: number;
    id__in?: number[];
  },
): Promise<AxiosResponse<ShopItem>> {
  return getAuth(
    `${API_V1_URI}/shop/item/get_all/${buildUrlParams({
      ...params,
      is_base_item: false,
      is_variant: false,
    })}`,
  );
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
 * Fetch a list of shop item. By passing page_size the API response gets paginated
 * @param base_shop_item_template Filter by
 * @param color Filter by color field value
 * @param company__in  Filter items from specific companies only
 * @param id__not_in Exclude specific items by id
 * @param is_base_item Include items that are base items (have variants)
 * @param is_standalone_item Include items that are standalone
 * @param is_variant Include items that are variants (related to a base item)
 * @param size Filter by size field value
 * @param page_size The number of items to retrieve per page
 * @param page The page number to retrieve
 * @param establishment_billing_group Filter by establishment billing group
 */
export const fetchShopItemList = (params?: ShopItemFilterParams) => {
  return getAuth<PaginatedResponse<ShopItem>>(
    `${API_V1_URI}/shop/item/${buildUrlParams(params)}`,
  );
};

/**
 * Retrieves a base/standalone item.
 * @param id The ID of the shop item
 * @param params Optional parameters to filter the item details, such as establishment billing group
 */
export const retrieveShopItemDetails = (
  id: number,
  params?: Pick<ShopItemFilterParams, 'establishment_billing_group'>,
) => {
  return getAuth<ShopItem>(
    `${API_V1_URI}/shop/item/${id}/${buildUrlParams(params)}`,
  );
};

/**
 * Check if a provided shop item barcode is unique (not used by another shop item)
 * @param barcode The barcode to check
 */
export const retrieveShopItemBarcodeUnicity = (
  barcode: string,
  company_ids?: number[],
) => {
  const params = {
    barcode,
    ...(company_ids && !!company_ids?.length && { company_ids }),
  };

  return getAuth<ShopItemBarcodeUnicity>(
    `${API_V1_URI}/shop/item/barcode-unicity/${buildUrlParams(params)}`,
  );
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
  return postAuth<ShopItem[]>(`${API_V1_URI}/shop/item/${id}/variants/`, data);
};

/**
 * Creates one or more variants from an existing base item template.\
 * Params are all existing variant attributes
 * @param id The base item template id to create variants from
 * @param color An array of strings
 * @param size An array of strings
 */
export const createShopItemTemplateVariants = (
  id: number,
  data: ShopItemVariantAttributes,
) => {
  return postAuth<ShopItem[]>(
    `${API_V1_URI}/shop/shopitemtemplate/${id}/variants/`,
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
 * Updates one or multiple shop item template variants related to a base item template.\
 * Params are all existing variant attributes
 * @param id The ID of the base item template
 * @param data The payload sent to the API. Array of variants item fields expected.
 */
export const updateShopItemTemplateVariantBulk = (
  id: number,
  data: FormData,
) => {
  /**
   * Response:
   * - 204 on success.
   * - 404 if the base item cannot be found.
   * - 400 if the update couldn't be processed correctly.
   */
  return patchAuth<void>(
    `${API_V1_URI}/shop/shopitemtemplate/${id}/variants/bulk_update/`,
    data,
  );
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
 * @param page The page number used to fetch suppliers
 * @param page_size The number of suppliers to fetch per page
 */
export const fetchShopSupplierList = (params: PaginationFilterParams) => {
  return getAuth<PaginatedResponse<ShopSupplier>>(
    `${API_V1_URI}/shop/supplier/${buildUrlParams(params)}`,
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
 * Fetch the list of all shop supplier templates
 * @param params Default pagination params {@link PaginationFilterParams}
 */
export const fetchShopSupplierTemplateList = (
  params: PaginationFilterParams,
) => {
  return getAuth<PaginatedResponse<ShopSupplierTemplate>>(
    `${API_V1_URI}/shop/suppliertemplate/${buildUrlParams(params)}`,
  );
};

/**
 * Creates a new shop supplier template
 * @param data The payload sent to the API
 */
export const createShopSupplierTemplate = (
  data: ShopSupplierTemplateCreate,
) => {
  return postAuth<ShopSupplierTemplate>(
    `${API_V1_URI}/shop/suppliertemplate/`,
    data,
  );
};

/**
 * Updates an existing shop supplier template
 * @param data The payload sent to the API
 */
export const updateShopSupplierTemplate = (data: ShopSupplierUpdate) => {
  return patchAuth<ShopSupplierTemplate>(
    `${API_V1_URI}/shop/suppliertemplate/${data.id}/`,
    {
      name: data.name,
      description: data.description,
    },
  );
};

/**
 * Deletes an existing shop supplier template
 * @param id The ID of the supplier template to delete
 */
export const deleteShopSupplierTemplate = (id: number) => {
  return deleteAuth(`${API_V1_URI}/shop/suppliertemplate/${id}`);
};

/**
 * Creates a `Provision` object to update stock quantity of a shop item
 * @param data Provision creation payload
 */
export const createShopItemProvision = (data: ProvisionCreate) => {
  return postAuth<Provision>(`${API_V1_URI}/shop/provision/`, data);
};

/**
 * Creates several `Provision` objects to update stock
 * quantity of multiple shop items at once
 * @param data Provision creation payload
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

/**
 * Fetch the list of existing variant combination for a base item
 * @param id The ID of the base item
 */
export const fetchShopItemVariantCombinationList = (id: number) => {
  return getAuth<ShopItemVariantCombination[]>(
    `${API_V1_URI}/shop/item/${id}/variants/`,
  );
};

/**
 * Fetch the list of existing variant combination for a base item template
 * @param id The ID of the base item template
 */
export const fetchShopItemTemplateVariantCombinationList = (id: number) => {
  return getAuth<ShopItemVariantCombination[]>(
    `${API_V1_URI}/shop/shopitemtemplate/${id}/variants/`,
  );
};

/**
 * Fetch the list of existing subshop templates
 */
export const fetchSubshopTemplateList = (params?: PaginationFilterParams) => {
  return getAuth<PaginatedResponse<SubshopTemplate>>(
    `${API_V1_URI}/shop/subshoptemplate/${buildUrlParams(params)}`,
  );
};

/**
 * Creates a new subshop template
 * @param data Object containing the name/franchisor/company_ids of the subshop template
 */
export const createSubshopTemplate = (data: SubshopTemplateCreate) => {
  return postAuth<SubshopTemplate>(`${API_V1_URI}/shop/subshoptemplate/`, data);
};

/**
 * Updates an existing subshop template
 * @param data Object containing the updated fields of the subshop template
 */
export const updateSubshopTemplate = (data: SubshopTemplateUpdate) => {
  return patchAuth<SubshopTemplate>(
    `${API_V1_URI}/shop/subshoptemplate/${data.id}/`,
    data,
  );
};

/**
 * Deletes an existing subshop template
 * @param id The ID of the subshop template to delete
 */
export const deleteSubshopTemplate = (id: number) => {
  return deleteAuth(`${API_V1_URI}/shop/subshoptemplate/${id}/`);
};

/**
 * Fetch the list of existing shop item templates
 * @param params An object containing the pagination and required property `subshops` {@link ShopItemTemplateFilterParams}
 */
export const fetchShopItemTemplateList = (
  params: ShopItemTemplateFilterParams,
) => {
  return getAuth<PaginatedResponse<ShopItemTemplate>>(
    `${API_V1_URI}/shop/shopitemtemplate/${buildUrlParams(params)}`,
  );
};

/**
 * Retrieves a base/standalone item template
 * @param id The ID of the shop item template
 */
export const retrieveShopItemTemplate = (id: number) => {
  return getAuth<ShopItemTemplate>(`${API_V1_URI}/shop/shopitemtemplate/${id}`);
};

/**
 * Creates a new shop item template. Creates shop item variants template if variant properties are detected (async task).
 * @param data Form data containing shop item properties and required `sub_shop_template` in addition to `company_ids[n]`
 */
export const createShopItemTemplate = (data: FormData) => {
  return postAuth(`${API_V1_URI}/shop/shopitemtemplate/`, data);
};

/**
 * Updates an existing shop item template. If shop item variants templates exist, they will also be updated (async task).
 * @param data Form data containing the updated fields of the shop item template
 */
export const updateShopItemTemplate = (id: number, formData: FormData) => {
  return patchAuth(`${API_V1_URI}/shop/shopitemtemplate/${id}/`, formData);
};

/**
 * Deletes an existing shop item template
 * @param id The ID of the shop item template to delete
 */
export const deleteShopItemTemplate = (id: number) => {
  return deleteAuth(`${API_V1_URI}/shop/shopitemtemplate/${id}/`);
};

/**
 * Duplicates an existing standalone shop item template
 * @param id The ID of the shop item template to duplicate
 * @param suffix The string to concat at the end of the name of the duplicated item
 */
export const duplicateShopItemTemplate = (id: number, suffix: string) => {
  return postAuth<ShopItem>(
    `${API_V1_URI}/shop/shopitemtemplate/${id}/duplicate/`,
    {
      suffix,
    },
  );
};
