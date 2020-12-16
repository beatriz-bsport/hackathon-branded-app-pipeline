// @flow

import {
  API_URI,
  getAuth,
  postAuth,
  patchAuth,
  putAuth,
  deleteAuth,
  API_V1_URI,
  buildUrlParams,
} from '../../http.ts';

export async function fetchAllPaymentPacks() {
  return getAuth(`${API_URI}/saas/payment-pack/`);
}

export const scalePaymentPackCredit = async (id: number, data: any) => {
  return postAuth(
    `${API_V1_URI}/payment-pack/payment-pack/${id}/scale_credit/`,
    data,
  );
};

export async function create(data) {
  return postAuth(`${API_URI}/saas/payment-pack/add/`, data);
}

export async function fetchOne(id) {
  return getAuth(`${API_V1_URI}/payment-pack/payment-pack/${id}`);
}

export async function edit(data) {
  return putAuth(`${API_URI}/saas/payment-pack/${data.id}/edit/`, data);
}

export async function patch(id, data) {
  return patchAuth(`${API_URI}/saas/payment-pack/${id}/edit/`, data);
}

export async function disableConsumerPack(id) {
  return patchAuth(`${API_URI}/saas/payment-pack/consumer/${id}/disable`);
}

export async function fetchPaymentPackList(params) {
  return getAuth(
    `${API_V1_URI}/payment-pack/payment-pack/${buildUrlParams(params)}`,
  );
}

export async function fetchPaymentPackCompatibleList(params: any = {}) {
  return getAuth(
    `${API_V1_URI}/payment-pack/payment-pack/compatible/${buildUrlParams(
      params,
    )}`,
  );
}

export async function fetchCompanyPaymentPacks(companyId) {
  return getAuth(
    `${API_V1_URI}/payment-pack/payment-pack/?company=${companyId}`,
  );
}

// BEGIN Notification
//
//  --------------------

export async function fetchPaymentPackNotifications(paymentPackId: number) {
  return getAuth(
    `${API_V1_URI}/payment-pack/notification/?payment_pack=${paymentPackId}`,
  );
}

export async function createPaymentPackNotifications(data: any) {
  return postAuth(`${API_V1_URI}/payment-pack/notification/`, data);
}

export async function deletePaymentPackNotifications(id: number) {
  return deleteAuth(`${API_V1_URI}/payment-pack/notification/${id}/`);
}

export async function updatePaymentPackNotifications(data: any) {
  return patchAuth(`${API_V1_URI}/payment-pack/notification/${data.id}/`, data);
}

//  --------------------
//
// END Notification

export default {
  fetchAll: fetchAllPaymentPacks,
  create,
  fetchOne,
  patch,
  edit,
  disableConsumerPack,
};
