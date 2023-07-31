import { AxiosResponse } from 'axios';
import { PaginatedResponse } from '../../state/types';
import {
  API_V1_URI,
  postAuth,
  getAuth,
  patchAuth,
  buildUrlParams,
  deleteAuth,
} from '../../http';
import {
  IsShopUsedInComboAPI,
  Provision,
  ShopItem,
  ShopAPIFilter,
  SubShop,
  SubShopAPI,
  ShopItemCreate,
  ProvisionCreate,
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
  shopItemData: ShopItem,
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
