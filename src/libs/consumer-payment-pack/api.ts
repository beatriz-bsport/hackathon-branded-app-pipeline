import {
  API_V1_URI,
  postAuth,
  deleteAuth,
  getAuth,
  buildUrlParams,
} from '../../http';

export async function fetchByOfferByMember(offer: any, data: any = {}) {
  return postAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/compatible_with_offer/${buildUrlParams(
      data,
    )}`,
    { offer },
  );
}

export async function fetchByOfferByMemberV2(offer: any, data: any = {}) {
  return postAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/compatible_with_offer_v2/${buildUrlParams(
      data,
    )}`,
    { offer },
  );
}

export async function fetchNonCompatibleByOfferByMember(
  offer: any,
  data: any = {},
) {
  return postAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/noncompatible_with_offer/${buildUrlParams(
      data,
    )}`,
    { offer },
  );
}

export async function fetchConsumerPackList(params: any = {}) {
  return getAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/${buildUrlParams({
      ...(params || {}),
    })}`,
  );
}

export async function fetchExtensions(consumerPassId: number) {
  return getAuth(
    `${API_V1_URI}/payment-pack/pack-extension/?consumer_payment_pack=${consumerPassId}`,
  );
}

export async function createExtension(data: any) {
  return postAuth(`${API_V1_URI}/payment-pack/pack-extension/`, data);
}

export async function fetchMassExtensions(data: any) {
  return getAuth(
    `${API_V1_URI}/payment-pack/mass-extension/?payment_pack=${data.paymentPack}&page=${data.page}&page_size=${data.page_size}`,
  );
}

export async function createMassExtension(data: any) {
  return postAuth(`${API_V1_URI}/payment-pack/mass-extension/`, data);
}

export async function deleteMassExtension(id: number) {
  return deleteAuth(`${API_V1_URI}/payment-pack/mass-extension/${id}`);
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

export async function fetchConsumerPaymentPackCreditRefundList(params: any) {
  return getAuth(
    `${API_V1_URI}/payment-pack/credit-refund/${buildUrlParams(params)}`,
  );
}

export async function addCreditToConsumerPack(id: number, nbCredit: number) {
  return postAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/${id}/add_credit/`,
    { nbCredit },
  );
}

export async function subCreditToConsumerPack(id: number, nbCredit: number) {
  return postAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/${id}/sub_credit/`,
    { nbCredit },
  );
}

export async function unblock(id: number) {
  return postAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/${id}/unblock/`,
  );
}

export async function fetchConsumerPaymentPackCompatibleList(params: any) {
  return postAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/compatible/`,
    params,
  );
}

export async function fetchConsumerPaymentPackPenalty(params: any) {
  return getAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack-penalty/${buildUrlParams(
      params,
    )}`,
  );
}

export async function fetchConsumerPaymentPackMaxoutBooking(params: any) {
  return postAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/maxout_booking/${buildUrlParams(
      params,
    )}`,
  );
}

export default {
  fetchByOfferByMember,
  fetchExtensions,
  createExtension,
  deleteExtension,
};
