// @ts-nocheck
import { FranchiseProductTemplateQueryParams } from '#libs/franchise/types';
import {
  API_URI,
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
  API_V1_URI,
  postBaseAuthDeprecated,
  buildUrlParams,
  getAuthDeprecated,
  patchAuthDeprecated,
  postAuthDeprecated,
  putAuthDeprecated,
} from '../../http';

import type {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackCompatibilitiesData,
} from './types';

export async function fetchAllPaymentPacks() {
  return getAuthDeprecated(
    `${API_V1_URI}/payment-pack/payment-pack/?page_size=70000`,
  );
}

export const scalePaymentPackCredit = async (id: number, data: any) => {
  return postAuth(
    `${API_V1_URI}/payment-pack/payment-pack/${id}/scale_credit/`,
    data,
  );
};

export async function create(data: any) {
  return postAuthDeprecated(`${API_URI}/saas/payment-pack/add/`, data);
}

export async function fetchOne(id: number) {
  return getAuthDeprecated(`${API_V1_URI}/payment-pack/payment-pack/${id}/`);
}

export async function edit(data: any) {
  return putAuthDeprecated(
    `${API_URI}/saas/payment-pack/${data.id}/edit/`,
    data,
  );
}

export async function editOrder(data: any) {
  return patchAuthDeprecated(
    `${API_V1_URI}/payment-pack/payment-pack/set_multiple_order/`,
    data,
  );
}

export function editPackCompatibilities(
  paymentPackId: number,
  data: PaymentPackCompatibilitiesData,
) {
  return patchAuth<PaymentPack>(
    `${API_V1_URI}/payment-pack/payment-pack/${paymentPackId}/compatibilities/`,
    data,
  );
}

export async function isPaymentPackUsedInCombo(id: number) {
  return postAuthDeprecated(
    `${API_V1_URI}/payment-pack/payment-pack/${id}/check_archive_side_effects/`,
  );
}

export async function patch(id: number, data: any) {
  return patchAuthDeprecated(`${API_URI}/saas/payment-pack/${id}/edit/`, data);
}

export async function disableConsumerPack(id: number) {
  return patchAuth(`${API_URI}/saas/payment-pack/consumer/${id}/disable`);
}

export async function fetchPaymentPackList(params: any) {
  return getAuthDeprecated(
    `${API_V1_URI}/payment-pack/payment-pack/${buildUrlParams(params)}`,
  );
}

export async function fetchPaymentPackCompatibleList(params: any = {}) {
  return getAuthDeprecated(
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

export async function fetchAllPaymentPackCategory({
  companyId,
}: {
  companyId?: number;
}) {
  if (companyId) {
    return getAuthDeprecated(
      `${API_V1_URI}/payment-pack/payment-pack-category/${buildUrlParams({
        companyId,
      })}`,
    );
  }
  return getAuth(`${API_V1_URI}/payment-pack/payment-pack-category/`);
}

export async function fetchPaymentPackTemplateList(
  params?: FranchiseProductTemplateQueryParams,
) {
  return getAuthDeprecated(
    `${API_V1_URI}/payment-pack/payment-pack-template/${buildUrlParams(
      params,
    )}`,
  );
}

export async function retrievePaymentPackTemplate(id: number) {
  return getAuthDeprecated(
    `${API_V1_URI}/payment-pack/payment-pack-template/${id}/`,
  );
}

export async function createOrUpdatePaymentPackTemplate(data: any) {
  if (!data.id) {
    return postAuthDeprecated(
      `${API_V1_URI}/payment-pack/payment-pack-template/`,
      data,
    );
  }
  return putAuthDeprecated(
    `${API_V1_URI}/payment-pack/payment-pack-template/${data.id}/`,
    data,
  );
}

export async function createPaymentPackTemplateInstance(data: any) {
  return postAuthDeprecated(
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
  return putAuthDeprecated(
    `${API_V1_URI}/payment-pack/payment-pack-category/${paymentPackCategory.id}/`,
    paymentPackCategory,
  );
}

export async function editCategoryOrder(data: any) {
  return patchAuthDeprecated(
    `${API_V1_URI}/payment-pack/payment-pack-category/set_order/`,
    data,
  );
}

export async function createPaymentPackCategory(
  paymentPackCategory: PaymentPackCategory,
) {
  return postBaseAuthDeprecated(
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
