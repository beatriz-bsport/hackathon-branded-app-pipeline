// @flow
import {
  API_V1_URI,
  postAuth,
  deleteAuth,
  getAuth,
  buildUrlParams,
} from '../../http';

export async function fetchByOfferByMember(offer, data: any = {}) {
  return postAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/compatible_with_offer/${buildUrlParams(
      data,
    )}`,
    { offer },
  );
}

export async function fetchNonCompatibleByOfferByMember(offer, data: any = {}) {
  return postAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/noncompatible_with_offer/${buildUrlParams(
      data,
    )}`,
    { offer },
  );
}
export async function fetchExtensions(consumerPassId: number) {
  return getAuth(
    `${API_V1_URI}/payment-pack/pack-extension/?consumer_payment_pack=${consumerPassId}`,
  );
}

export async function fetchConsumerPackList(params: any) {
  return getAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/${buildUrlParams(
      params,
    )}`,
  );
}

export async function createExtension(data: any) {
  return postAuth(`${API_V1_URI}/payment-pack/pack-extension/`, data);
}

export async function deleteExtension(id: number) {
  return deleteAuth(`${API_V1_URI}/payment-pack/pack-extension/${id}/`);
}

export async function refundConsumerPaymentPack(id: number, data: any) {
  return postAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/${id}/partial_refund/`,
    data,
  );
}

export default {
  fetchByOfferByMember,
  fetchExtensions,
  createExtension,
  deleteExtension,
};
