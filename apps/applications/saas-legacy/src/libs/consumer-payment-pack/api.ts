import { postAuth, deleteAuth, getAuth, buildUrlParams } from '../../http';
import { cleanParams } from '../../utils/createUrlHandlers';
import type { PaginatedResponse } from '../../state/types';
import type {
  ConsumerPaymentPack,
  ConsumerPaymentPackExtension,
  ConsumerPaymentPackExtensionCreate,
  ConsumerPaymentPackExtensionParams,
  ConsumerPaymentPackREST,
} from './types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BUYABLE_V1;

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

/**
 * Fetch a specific consumer payment pack
 * @param id the id of the `consumer_payment_pack` we want to fetch
 */
export async function fetchConsumerPack(id: number) {
  return getAuth<ConsumerPaymentPack>(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/${id}`,
  );
}

/**
 * Fetch the list of extensions for a specific consumer payment pack
 * @param params Object containing the required `consumer_payment_pack` ID + optional pagination params
 */
export const fetchConsumerPaymentPackExtensionList = (
  params: ConsumerPaymentPackExtensionParams,
) => {
  return getAuth<PaginatedResponse<ConsumerPaymentPackExtension>>(
    `${API_V1_URI}/payment-pack/pack-extension/${buildUrlParams(params)}`,
  );
};

/**
 * Create an extension for a consumer payment pack
 * @param data The payload sent for the creation of the extension
 */
export const createConsumerPaymentPackExtension = (
  data: ConsumerPaymentPackExtensionCreate,
) => {
  return postAuth<ConsumerPaymentPackExtension>(
    `${API_V1_URI}/payment-pack/pack-extension/`,
    data,
  );
};

/**
 * Delete a consumer payment pack extension
 * @param id The ID of the extension to delete
 */
export const deleteConsumerPaymentPackExtension = (id: number) => {
  return deleteAuth(`${API_V1_URI}/payment-pack/pack-extension/${id}/`);
};

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

export async function activateManually(id: number, start_date: string) {
  return postAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/${id}/manual_activation/`,
    { start_date },
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
};
