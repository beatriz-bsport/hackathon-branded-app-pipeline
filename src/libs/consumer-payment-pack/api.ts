import {
  API_V1_URI,
  postAuth,
  deleteAuth,
  getAuth,
  buildUrlParams,
} from '../../http';
import { cleanParams } from '../../utils/createUrlHandlers';
import type { PaginatedResponse } from '../../state/types';
import type { ConsumerPaymentPackREST } from './types';

export async function fetchByOfferByMember(offer: any, data: any = {}) {
  return postAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/compatible_with_offer_unfiltered/${buildUrlParams(
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

export async function fetchIncompatibilitiesReasonsByOfferByConsumerPack(
  id: number,
  offer: number,
) {
  return getAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/${id}/incompatibility_error_code_list/${buildUrlParams(
      { offer },
    )}`,
  );
}

export async function fetchConsumerPackList(params: any = {}) {
  const cleanedParams = cleanParams(params);
  return getAuth<PaginatedResponse<ConsumerPaymentPackREST>>(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/${buildUrlParams({
      ...(cleanedParams || {}),
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
