import { PAYMENT_PACK as PAYMENT_METHOD_PAYMENT_PACK } from '@bsport/common/lib/master-data/payment-methods';
import {
  API_URI,
  API_V1_URI,
  BASE_URI,
  postAuth,
  PAYMENT_URI,
  getAuth,
  postBaseAuth,
} from '../http';

const BOOKING_SOURCE_WEB = 1;

export async function consumerFetchCompatiblePass(offerId, memberId) {
  return getAuth(
    `${API_URI}/pay/offer/${offerId}/compatible-packs${
      memberId ? `?consumer__member=${memberId}` : ''
    }`,
  );
}

export async function bookAnOption(offer, consumer) {
  return postAuth(`${BASE_URI}/api/v1/waiting-list/booking-option/register/`, {
    offer,
    consumer: parseInt(consumer, 10),
  });
}

export async function fetchBookingOption(optionId) {
  return getAuth(`${BASE_URI}/api/v1/waiting-list/booking-option/${optionId}/`);
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
    `${PAYMENT_URI}/buy/${PAYMENT_METHOD_PAYMENT_PACK.id}/offer/${offerId}?${formatParams}`,
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

export async function consumerRequestShopItem(shopItemId) {
  return getAuth(`${API_V1_URI}/shop/item/${shopItemId}`);
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
  fetchShopItem: consumerRequestShopItem,
  fetchCompatiblePass: consumerFetchCompatiblePass,
  fetchCompatiblePaymentPacks,
  fetchBookingOption,
};
