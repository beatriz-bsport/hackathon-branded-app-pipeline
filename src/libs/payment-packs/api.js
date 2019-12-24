import {
  API_URI,
  getAuth,
  postAuth,
  patchAuth,
  putAuth,
  API_V1_URI,
  buildUrlParams,
} from '../../http';

export async function addCreditToConsumerPack(paymentPackId, nbCredit) {
  return getAuth(
    `${API_URI}/saas/payment-pack/${paymentPackId}/add-credit/${nbCredit}`,
  );
}

export async function subCreditToConsumerPack(paymentPackId, nbCredit) {
  return getAuth(
    `${API_URI}/saas/payment-pack/${paymentPackId}/sub-credit/${nbCredit}`,
  );
}

export async function fetchAllPaymentPacks() {
  return getAuth(`${API_URI}/saas/payment-pack/`);
}

export async function create(data) {
  return postAuth(`${API_URI}/saas/payment-pack/add/`, data);
}

export async function fetchOne(id) {
  return getAuth(`${API_URI}/saas/payment-pack/${id}`);
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

export async function fetchCompanyPaymentPacks(companyId) {
  return getAuth(
    `${API_V1_URI}/payment-pack/payment-pack/?company=${companyId}`,
  );
}

export default {
  fetchAll: fetchAllPaymentPacks,
  addCredit: addCreditToConsumerPack,
  subCredit: subCreditToConsumerPack,
  create,
  fetchOne,
  patch,
  edit,
  disableConsumerPack,
};
