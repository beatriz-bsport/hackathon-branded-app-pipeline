import { API_URI, getAuth, postAuth, patchAuth, putAuth } from '../../http';

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

export async function edit(data) {
  return putAuth(`${API_URI}/saas/payment-pack/${data.id}/edit/`, data);
}

export async function patch(id, data) {
  return patchAuth(`${API_URI}/saas/payment-pack/${id}/edit/`, data);
}

export async function disableConsumerPack(id) {
  return patchAuth(`${API_URI}/saas/payment-pack/consumer/${id}/disable`);
}

export default {
  fetchAll: fetchAllPaymentPacks,
  addCredit: addCreditToConsumerPack,
  subCredit: subCreditToConsumerPack,
  create,
  patch,
  edit,
  disableConsumerPack,
};
