// @flow
import {
  API_V1_URI,
  postAuth,
  getAuth,
  putAuth,
  patchAuth,
  buildUrlParams,
  deleteAuth,
} from '../../http';

export async function fetchAll(params: any) {
  return getAuth(`${API_V1_URI}/shop/item/${buildUrlParams(params)}`);
}

export async function fetchOld(params: any) {
  return getAuth(`${API_V1_URI}/shop/item/get_all/${buildUrlParams(params)}`);
}

export async function fetchShopItem(id: number) {
  return getAuth(`${API_V1_URI}/shop/item/${id}/`);
}

export async function fetchAllSubShop({ companyId }: { companyId?: number }) {
  let queryParams = '';
  if (companyId) {
    queryParams += `?company=${companyId}`;
  }
  return getAuth(`${API_V1_URI}/shop/subshop/${queryParams}`);
}

export async function createItem(shopItemData: *) {
  return postAuth(`${API_V1_URI}/shop/item/`, shopItemData);
}

export async function updateItem(shopItemData: *, id: number) {
  return patchAuth(`${API_V1_URI}/shop/item/${id}/`, shopItemData);
}

export async function deleteItem(shopItemId: number) {
  return deleteAuth(`${API_V1_URI}/shop/item/${shopItemId}/`);
}

export async function duplicateItem(shopItemId: number, suffix: string) {
  return postAuth(`${API_V1_URI}/shop/item/${shopItemId}/duplicate/`, {
    suffix,
  });
}

export async function updateProvisions(qty: number, shopItemId: number) {
  return putAuth(`${API_V1_URI}/shop/item/${shopItemId}/provisions/add`, {
    qty,
  });
}

export async function createProvision(data: *) {
  return postAuth(`${API_V1_URI}/shop/provision/`, data);
}

export async function createSubShop(data: *) {
  return postAuth(`${API_V1_URI}/shop/subshop/`, { name: data.name });
}

export async function updateSubShop(data: *) {
  return patchAuth(`${API_V1_URI}/shop/subshop/${data.id}/`, data);
}

export async function deleteProvision({
  provisionId,
  shopItemId,
}: {
  provisionId: number,
  shopItemId: number,
}) {
  return deleteAuth(
    `${API_V1_URI}/shop/items/${shopItemId}/provisions/${provisionId}`,
  );
}

export async function deleteSubShop(id: number) {
  return deleteAuth(`${API_V1_URI}/shop/subshop/${id}/`);
}

export async function fetchProvisions(
  shopitemId: number,
  page: ?number,
  page_size: ?number,
) {
  let urlParams = '';
  if (page && page_size) {
    urlParams = `&page=${page}&page_size=${page_size}`;
  }
  return getAuth(
    `${API_V1_URI}/shop/provision/?shop_item=${shopitemId}${urlParams}`,
  );
}

export default {
  fetchAll,
  fetchAllSubShop,
  createItem,
  updateItem,
  deleteItem,
  updateProvisions,
  createProvision,
  deleteProvision,
  createSubShop,
  updateSubShop,
  deleteSubShop,
  fetchShopItem,
  fetchProvisions,
  duplicateItem,
};
