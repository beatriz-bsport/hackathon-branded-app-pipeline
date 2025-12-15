import {
  FranchiseProductTemplateQueryParams,
  FranchiseProductTemplatePaginatedQueryParams,
} from '#src/libs/franchise/types';
import {
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
  postBaseAuthDeprecated,
  buildUrlParams,
  getAuthDeprecated,
  patchAuthDeprecated,
  postAuthDeprecated,
  putAuthDeprecated,
} from '#src/http';

import type { PaginatedResponse } from '#src/state/types';

import type {
  PaymentPack,
  PaymentPackCompatibilitiesData,
  PaymentPackCategory,
  PaymentPackMassExtension,
  PaymentPackMassExtensionCreate,
  PaymentPackMassExtensionParams,
  PaymentPackQueryParams,
  PaymentPackTemplateAPI,
  PaymentPackTemplate,
} from './types';
import Config from '#src/config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BUYABLE_V1;
const API_URI = Config.REACT_APP_BASE_URI_BUYABLE_V0;

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
  return patchAuth(`${API_URI}/saas/payment-pack/consumer/${id}/disable`, {});
}

export async function fetchPaymentPackList(params: PaymentPackQueryParams) {
  return getAuth<PaginatedResponse<PaymentPack>>(
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

export async function fetchPaymentPackTemplateListPaginated(
  params?: FranchiseProductTemplatePaginatedQueryParams,
) {
  return getAuth<PaginatedResponse<PaymentPackTemplateAPI>>(
    `${API_V1_URI}/payment-pack/payment-pack-template/${buildUrlParams(
      params,
    )}`,
  );
}

export function fetchUniversalPaymentPackTemplateList(
  params?: FranchiseProductTemplateQueryParams,
) {
  return getAuth<
    PaginatedResponse<PaymentPackTemplate> | PaymentPackTemplate[]
  >(
    `${API_V1_URI}/payment-pack/universal-pass-template/${buildUrlParams(
      params,
    )}`,
  );
}

export function fetchUniversalPaymentPackTemplatePaginatedList(
  params?: FranchiseProductTemplatePaginatedQueryParams,
) {
  return getAuth<PaginatedResponse<PaymentPackTemplateAPI>>(
    `${API_V1_URI}/payment-pack/universal-pass-template/${buildUrlParams(
      params,
    )}`,
  );
}

export async function retrievePaymentPackTemplate(id: number) {
  return getAuthDeprecated(
    `${API_V1_URI}/payment-pack/payment-pack-template/${id}/`,
  );
}

export function retrieveUniversalPaymentPackTemplate(id: number) {
  return getAuthDeprecated(
    `${API_V1_URI}/payment-pack/universal-pass-template/${id}/`,
  );
}

export async function createOrUpdatePaymentPackTemplate(
  data: PaymentPackTemplateAPI,
) {
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

export async function createOrUpdateUniversalPaymentPackTemplate(
  data: PaymentPackTemplateAPI,
) {
  if (!data.id) {
    return postAuthDeprecated(
      `${API_V1_URI}/payment-pack/universal-pass-template/`,
      data,
    );
  }
  return putAuthDeprecated(
    `${API_V1_URI}/payment-pack/universal-pass-template/${data.id}/`,
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

export async function restorePaymentPackTemplate(id: number) {
  return postAuth(
    `${API_V1_URI}/payment-pack/payment-pack-template/${id}/restore/`,
  );
}

export function deleteUniversalPaymentPackTemplate(id: number) {
  return deleteAuth(
    `${API_V1_URI}/payment-pack/universal-pass-template/${id}/`,
  );
}

export function restoreUniversalPaymentPackTemplate(id: number) {
  return postAuth<PaymentPackTemplateAPI>(
    `${API_V1_URI}/payment-pack/universal-pass-template/${id}/restore/`,
  );
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

/**
 * Fetch the list of mass extensions for a specific payment pack
 * @param params Object containing the required `payment_pack` ID + optional pagination params
 */
export const fetchPaymentPackMassExtensionList = (
  params: PaymentPackMassExtensionParams,
) => {
  return getAuth<PaginatedResponse<PaymentPackMassExtension>>(
    `${API_V1_URI}/payment-pack/mass-extension/${buildUrlParams(params)}`,
  );
};

/**
 * Create an extension for a payment pack
 * @param data The payload sent for the creation of the extension
 */
export const createPaymentPackMassExtension = (
  data: PaymentPackMassExtensionCreate,
) => {
  return postAuth<PaymentPackMassExtension>(
    `${API_V1_URI}/payment-pack/mass-extension/`,
    data,
  );
};

/**
 * Delete a payment pack extension
 * @param id The ID of the extension to delete
 */
export const deletePaymentPackMassExtension = (id: number) => {
  return deleteAuth(`${API_V1_URI}/payment-pack/mass-extension/${id}`);
};

export default {
  fetchAll: fetchAllPaymentPacks,
  create,
  fetchOne,
  patch,
  edit,
  disableConsumerPack,
};
