import { API_URI, PAYMENT_URI, getAuth, postAuth } from '../http';

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
  return postAuth(`${PAYMENT_URI}/buy/pass/offer/${offerId}?${formatParams}`, {
    token: consumerPaymentPackId,
  });
}

export async function consumerRequestOffer(offerId) {
  return getAuth(`${API_URI}/offer/${offerId}/`);
}

export async function consumerBuy({
  token,
  paymentMethod,
  objectId,
  objectClassName,
  urlParams,
}) {
  let formatParams = '';
  if (urlParams) {
    formatParams = Object.keys(urlParams)
      .map((k) => `${k}=${urlParams[k]}`)
      .join(',');
  }
  return postAuth(
    `${PAYMENT_URI}/buy/${paymentMethod}/${objectClassName}/${objectId}?${formatParams}`,
    {
      token,
    },
  );
}

export async function consumerRequestPaymentPack(paymentPackId) {
  return getAuth(`${API_URI}/saas/payment-pack/${paymentPackId}`);
}

export default {
  consumerBuy,
  payWithConsumerPaymentPack: consumerPayWithConsumerPaymentPack,
  fetchOffer: consumerRequestOffer,
  fetchPaymentPack: consumerRequestPaymentPack,
  fetchCompatiblePass: consumerFetchCompatiblePass,
};
