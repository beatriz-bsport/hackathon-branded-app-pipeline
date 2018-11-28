import {
  BASE_URI,
  postAuth,
  getAuth,
  putAuth,
  patchAuth,
  deleteAuth,
} from '../http';

export async function fetchAll() {
  return getAuth(`${BASE_URI}/shop/items`);
}

export async function fetchAllSubShop() {
  return getAuth(`${BASE_URI}/shop/subshops`);
}

export async function createItem(shopItemData) {
  return postAuth(`${BASE_URI}/shop/items`, shopItemData);
}

export async function updateItem(shopItemData, id) {
  return patchAuth(`${BASE_URI}/shop/items/${id}/manager`, shopItemData);
}

export async function deleteItem(shopItemId) {
  return deleteAuth(`${BASE_URI}/shop/items/${shopItemId}/manager`);
}

export async function updateProvisions(qty, shopItemId) {
  return putAuth(`${BASE_URI}/shop/items/${shopItemId}/provisions/add`, {
    qty,
  });
}

export async function createSubShop(data) {
  return postAuth(`${BASE_URI}/shop/subshops`, { name: data.name });
}

export async function updateSubShop(data) {
  return putAuth(`${BASE_URI}/shop/subshops/${data.id}`, data);
}

export async function deleteProvision({ provisionId, shopItemId }) {
  return deleteAuth(
    `${BASE_URI}/shop/items/${shopItemId}/provisions/${provisionId}`,
  );
}

export async function deleteSubShop(id) {
  return deleteAuth(`${BASE_URI}/shop/subshops/${id}`);
}

export default {
  fetchAll,
  fetchAllSubShop,
  createItem,
  updateItem,
  deleteItem,
  updateProvisions,
  deleteProvision,
  createSubShop,
  updateSubShop,
  deleteSubShop,
};
