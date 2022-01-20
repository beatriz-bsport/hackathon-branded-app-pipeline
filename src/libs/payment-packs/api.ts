import {
  API_URI,
  getAuth,
  postAuth,
  patchAuth,
  putAuth,
  deleteAuth,
  API_V1_URI,
  postBaseAuth,
  buildUrlParams,
} from '../../http';

import type { PaymentPackCategory } from './types';

export async function fetchAllPaymentPacks() {
  return getAuth(`${API_URI}/saas/payment-pack/`);
}

export const scalePaymentPackCredit = async (id: number, data: any) => {
  return postAuth(
    `${API_V1_URI}/payment-pack/payment-pack/${id}/scale_credit/`,
    data,
  );
};

export async function create(data: any) {
  return postAuth(`${API_URI}/saas/payment-pack/add/`, data);
}

export async function fetchOne(id: number) {
  return getAuth(`${API_V1_URI}/payment-pack/payment-pack/${id}`);
}

export async function edit(data: any) {
  return putAuth(`${API_URI}/saas/payment-pack/${data.id}/edit/`, data);
}

export async function editOrder(data: any) {
  return patchAuth(
    `${API_V1_URI}/payment-pack/payment-pack/set_multiple_order/`,
    data,
  );
}

export async function isPaymentPackUsedInCombo(id: number) {
  return postAuth(
    `${API_V1_URI}/payment-pack/payment-pack/${id}/check_archive_side_effects/`,
  );
}

export async function patch(id: number, data: any) {
  return patchAuth(`${API_URI}/saas/payment-pack/${id}/edit/`, data);
}

export async function disableConsumerPack(id: number) {
  return patchAuth(`${API_URI}/saas/payment-pack/consumer/${id}/disable`);
}

export async function fetchPaymentPackList(params: any) {
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

export async function fetchCompanyPaymentPacks(companyId: number) {
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

export async function fetchAllPaymentPackCategory({
  companyId,
}: {
  companyId?: number;
}) {
  return getAuth(
    `${API_V1_URI}/payment-pack/payment-pack-category/${buildUrlParams({
      companyId,
    })}`,
  );
}

export async function fetchPaymentPackTemplateList(params?: {
  franchisor?: number;
  id__in: Array<number>;
}) {
  return getAuth(
    `${API_V1_URI}/payment-pack/payment-pack-template/${buildUrlParams(
      params,
    )}`,
  );
}

export async function retrievePaymentPackTemplate(id: number) {
  return getAuth(`${API_V1_URI}/payment-pack/payment-pack-template/${id}/`);
}

export async function createOrUpdatePaymentPackTemplate(data: any) {
  if (!data.id) {
    return postAuth(`${API_V1_URI}/payment-pack/payment-pack-template/`, data);
  }
  return putAuth(
    `${API_V1_URI}/payment-pack/payment-pack-template/${data.id}/`,
    data,
  );
}

export async function createPaymentPackTemplateInstance(data: any) {
  return postAuth(
    `${API_V1_URI}/payment-pack/payment-pack-template-instance/multi_create/`,
    data,
  );
}

export async function deletePaymentPackTemplateInstance(id: number) {
  return deleteAuth(
    `${API_V1_URI}/payment-pack/payment-pack-template-instance/${id}/`,
  );
}

export async function deletePaymentPackTemplate(id: number) {
  return deleteAuth(`${API_V1_URI}/payment-pack/payment-pack-template/${id}/`);
}

export async function updatePaymentPackCategory(
  paymentPackCategory: PaymentPackCategory,
) {
  return putAuth(
    `${API_V1_URI}/payment-pack/payment-pack-category/${paymentPackCategory.id}/`,
    paymentPackCategory,
  );
}

export async function editCategoryOrder(data: any) {
  return patchAuth(
    `${API_V1_URI}/payment-pack/payment-pack-category/set_order/`,
    data,
  );
}

export async function createPaymentPackCategory(
  paymentPackCategory: PaymentPackCategory,
) {
  return postBaseAuth(
    `${API_V1_URI}/payment-pack/payment-pack-category/`,
    paymentPackCategory,
  );
}
export async function deletePaymentPackCategory(
  paymentPackCategory: PaymentPackCategory,
) {
  return deleteAuth(
    `${API_V1_URI}/payment-pack/payment-pack-category/${paymentPackCategory.id}/`,
  );
}
export default {
  fetchAll: fetchAllPaymentPacks,
  create,
  fetchOne,
  patch,
  edit,
  disableConsumerPack,
};
