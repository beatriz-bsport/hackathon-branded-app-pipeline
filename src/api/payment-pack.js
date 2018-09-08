import { API_URI, getAuth } from '../http';

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

export default {
  fetchAll: fetchAllPaymentPacks,
  addCredit: addCreditToConsumerPack,
  subCredit: subCreditToConsumerPack,
};
