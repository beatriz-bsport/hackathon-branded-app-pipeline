import { PAYMENT_PACK as PAYMENT_METHOD_PAYMENT_PACK } from '@bsport/common/lib/master-data/payment-methods';
import { API_URI, PAYMENT_URI, getAuth, postBaseAuth } from '../http';

const BOOKING_SOURCE_WEB = 1;

export async function consumerFetchCompatiblePass(offerId) {
  return getAuth(`${API_URI}/pay/offer/${offerId}/compatible-packs`);
}

export async function consumerPayWithConsumerPaymentPack(
  consumerPaymentPackId,
  offerId,
  urlParams,
) {
  let formatParams = '';
  if (urlParams) {
    formatParams = Object.keys(urlParams)
      .map((k) => `${k}=${urlParams[k]}`)
      .join(',');
  }
  return postBaseAuth(
    `${PAYMENT_URI}/buy/${
      PAYMENT_METHOD_PAYMENT_PACK.id
    }/offer/${offerId}?${formatParams}`,
    {
      token: consumerPaymentPackId,
      source: BOOKING_SOURCE_WEB,
    },
  );
}

export async function consumerRequestOffer(offerId) {
  return getAuth(`${API_URI}/offer/${offerId}/?noLog=true`);
}

export async function consumerBuy({
  token,
  paymentMethod,
  objectId,
  objectClassName,
  urlParams,
  offerToBuy,
}) {
  let formatParams = '';
  const data = { token, source: BOOKING_SOURCE_WEB };
  if (urlParams) {
    formatParams = Object.keys(urlParams)
      .map((k) => `${k}=${urlParams[k]}`)
      .join(',');
  }
  if (offerToBuy) {
    data.offerToBuy = offerToBuy;
  }
  return postBaseAuth(
    `${PAYMENT_URI}/buy/${paymentMethod}/${objectClassName}/${objectId}?${formatParams}`,
    data,
  );
}

export async function consumerRequestPaymentPack(paymentPackId) {
  return getAuth(`${API_URI}/saas/payment-pack/${paymentPackId}`);
}

export async function fetchCompatiblePaymentPacks(offerId) {
  return getAuth(
    `${API_URI}/consumer/offer/${offerId}/compatible-payment-packs`,
  );
}

export default {
  consumerBuy,
  payWithConsumerPaymentPack: consumerPayWithConsumerPaymentPack,
  fetchOffer: consumerRequestOffer,
  fetchPaymentPack: consumerRequestPaymentPack,
  fetchCompatiblePass: consumerFetchCompatiblePass,
  fetchCompatiblePaymentPacks,
};
