// @flow

import {
  API_V1_URI,
  postAuth,
  getAuth,
  putAuth,
  deleteAuth,
  patchAuth,
} from '../../http';

import type { ProductData } from './types';

export async function fetchOrders(
  page: number,
  companyId?: number,
  state?: number,
) {
  let urlParams = '';
  if (companyId) {
    urlParams += `&company=${companyId}`;
  }
  if (state) {
    urlParams += `&state=${state}`;
  }
  return getAuth(`${API_V1_URI}/order/?page=${page}${urlParams}`);
}

export async function fetchCurrentOrder(companyId: number) {
  return postAuth(`${API_V1_URI}/order/current/`, { company: companyId });
}

export async function fetchOrder(orderId: string) {
  return getAuth(`${API_V1_URI}/order/${orderId}/`);
}

export async function addProduct(productData: ProductData, orderId: number) {
  return putAuth(`${API_V1_URI}/order/${orderId}/add_product/`, productData);
}

export async function patchOrder(orderId: string, data: *) {
  return patchAuth(`${API_V1_URI}/order/${orderId}/`, data);
}

export async function patchConfiguration(data: *) {
  return patchAuth(`${API_V1_URI}/order/configuration/me/`, data);
}

export async function fetchConfiguration() {
  return getAuth(`${API_V1_URI}/order/configuration/me/`);
}

export async function fetchAllDeliveryFee() {
  return getAuth(`${API_V1_URI}/order/delivery-fee/`);
}

export async function createDeliveryFee(data: *) {
  return postAuth(`${API_V1_URI}/order/delivery-fee/`, data);
}

export async function updateDeliveryFee(data: *) {
  return patchAuth(`${API_V1_URI}/order/delivery-fee/${data.id}/`, data);
}

export async function removeProduct(productData: ProductData, orderId: number) {
  return deleteAuth(
    `${API_V1_URI}/order/${orderId}/remove_product/`,
    productData,
  );
}
