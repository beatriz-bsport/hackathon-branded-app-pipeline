import { API_URI, getAuth, postAuth } from '../http';

export async function consumerFetchCompatiblePass(offerId) {
  return getAuth(`${API_URI}/pay/offer/${offerId}/compatible-packs`);
}

export async function consumerPayWithConsumerPaymentPack(
  consumerPaymentPackId,
  offerId,
  urlParams,
) {
  const formatParams = Object.keys(urlParams)
    .map((k) => `${k}=${urlParams[k]}`)
    .join(',');
  return postAuth(`${API_URI}/pay/pass/offer/${offerId}?${formatParams}`, {
    token: consumerPaymentPackId,
  });
}

export async function consumerRequestOffer(offerId) {
  return getAuth(`${API_URI}/offer/${offerId}/`);
}

export async function payWithStripe(
  token,
  purchaseId,
  purchaseType,
  urlParams,
) {
  const formatParams = Object.keys(urlParams)
    .map((k) => `${k}=${urlParams[k]}`)
    .join(',');
  return postAuth(
    `${API_URI}/pay/stripe/${purchaseType}/${purchaseId}?${formatParams}`,
    {
      token,
    },
  );
}

export async function consumerRequestPaymentPack(paymentPackId) {
  return getAuth(`${API_URI}/saas/payment-pack/${paymentPackId}`);
}

export default {
  payWithStripe,
  payWithConsumerPaymentPack: consumerPayWithConsumerPaymentPack,
  fetchOffer: consumerRequestOffer,
  fetchPaymentPack: consumerRequestPaymentPack,
  fetchCompatiblePass: consumerFetchCompatiblePass,
};
