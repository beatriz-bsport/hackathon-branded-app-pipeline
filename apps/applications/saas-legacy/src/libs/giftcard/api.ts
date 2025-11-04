import { AxiosResponse } from 'axios';
import { cleanParams } from '../../utils/createUrlHandlers';
import {
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';
import type {
  Giftcard,
  ConsumerGiftcard,
  GiftcardBackgroundImage,
  GiftcardDataAPI,
  GiftcardAttributeMemberPayload,
  GiftcardAttributePrintableCodePayload,
  ConsumerGiftcardFilterParams,
} from './types';
import { PaginatedResponse } from '#src/state/types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BUYABLE_V1;

export const fetchGiftcardList = (
  params: any,
): Promise<AxiosResponse<Array<Giftcard>>> => {
  return getAuth(`${API_V1_URI}/giftcard/giftcard/${buildUrlParams(params)}`);
};

export const retrieveGiftcard = (
  id: number,
): Promise<AxiosResponse<Giftcard>> => {
  return getAuth(`${API_V1_URI}/giftcard/giftcard/${id}/`);
};

export const createOrUpdateGiftcard = (
  id: number | null,
  data: any,
): Promise<AxiosResponse<Giftcard>> => {
  if (!id) {
    return postAuth(`${API_V1_URI}/giftcard/giftcard/`, data);
  }
  return patchAuth(`${API_V1_URI}/giftcard/giftcard/${id}/`, data);
};

export const deleteGiftcard = (
  id: number,
): Promise<AxiosResponse<Giftcard>> => {
  return deleteAuth(`${API_V1_URI}/giftcard/giftcard/${id}/`);
};

export const fetchConsumerGiftcardList = (
  params: ConsumerGiftcardFilterParams,
) => {
  const cleanedParams = cleanParams(params);
  return getAuth<PaginatedResponse<ConsumerGiftcard>>(
    `${API_V1_URI}/giftcard/consumer_giftcard/${buildUrlParams(cleanedParams)}`,
  );
};

export const retrieveConsumerGiftcard = (
  id: number,
): Promise<AxiosResponse<ConsumerGiftcard>> => {
  return getAuth(`${API_V1_URI}/giftcard/consumer_giftcard/${id}/`);
};

export const retrieveConsumerGiftcardByActivationCode = (
  activation_code: string,
): Promise<AxiosResponse<ConsumerGiftcard>> => {
  return postAuth(
    `${API_V1_URI}/giftcard/consumer_giftcard/by_activation_code/`,
    { activation_code },
  );
};

/**
 * Link a digital consumer giftcard to a member from an activation link as a member
 * @param id The uuid of the digital giftcard to activate
 * @param data
 */
export const attributeMember = (
  id: number,
  data: GiftcardAttributeMemberPayload,
) => {
  return postAuth<ConsumerGiftcard>(
    `${API_V1_URI}/giftcard/consumer_giftcard/${id}/attribute_to_member/`,
    data,
  );
};

/**
 * Link a printable consumer giftcard to a member from a code as a manager
 * @param data
 */
export const attributeByPrintableCode = (
  data: GiftcardAttributePrintableCodePayload,
) => {
  return postAuth<ConsumerGiftcard>(
    `${API_V1_URI}/giftcard/consumer_giftcard/attribute_by_printable_code/`,
    data,
  );
};

export const sendEmailInvitation = (
  id: number,
  data: { email_sent_to: Array<string> },
): Promise<AxiosResponse<ConsumerGiftcard>> => {
  return postAuth(
    `${API_V1_URI}/giftcard/consumer_giftcard/${id}/send_email_invitation/`,
    data,
  );
};

export const createGiftcardBackgroundImage = (
  data: any,
): Promise<AxiosResponse<GiftcardBackgroundImage>> => {
  return postAuth(`${API_V1_URI}/giftcard/giftcard_background_image/`, data);
};

export const restoreGiftcard = (
  id: number,
): Promise<AxiosResponse<Giftcard>> => {
  return postAuth(`${API_V1_URI}/giftcard/giftcard/${id}/restore/`);
};

export const deleteGiftcardBackgroundImage = (
  id: number,
): Promise<AxiosResponse<GiftcardBackgroundImage>> => {
  return deleteAuth(`${API_V1_URI}/giftcard/giftcard_background_image/${id}/`);
};

export const fetchGiftcardBackgroundList = (
  companyId: number,
): Promise<AxiosResponse<Array<GiftcardBackgroundImage>>> => {
  return getAuth(
    `${API_V1_URI}/giftcard/giftcard_background_image/?company=${companyId}`,
  );
};

export async function makeGiftcardCopy(id: number) {
  return postAuth(`${API_V1_URI}/giftcard/giftcard/${id}/copy/`);
}

// ========== SHARED GIFTCARDS ==========

export async function fetchGiftcardTemplateList() {
  return getAuth(`${API_V1_URI}/giftcard/giftcard-template/`);
}

export function retrieveGiftcardTemplate(id: number) {
  return getAuth(`${API_V1_URI}/giftcard/giftcard-template/${id}/`);
}

export async function createOrUpdateGiftcardTemplate(
  id: number | null,
  data: GiftcardDataAPI,
) {
  if (!id) {
    return postAuth(`${API_V1_URI}/giftcard/giftcard-template/`, data);
  }
  return patchAuth(`${API_V1_URI}/giftcard/giftcard-template/${id}/`, data);
}

export async function deleteGiftcardTemplate(id: number) {
  return deleteAuth(`${API_V1_URI}/giftcard/giftcard-template/${id}/`);
}

export async function createGiftcardTemplateInstances(data: {
  companies: Array<number>;
  giftcard_template: number;
}) {
  return postAuth(
    `${API_V1_URI}/giftcard/giftcard-template-instance/multi_create/`,
    data,
  );
}

export async function deleteGiftcardTemplateInstance(
  giftcardTemplateId: number,
  companyId: number,
) {
  return deleteAuth(
    `${API_V1_URI}/giftcard/giftcard-template/${giftcardTemplateId}/delete_instance/`,
    { company_id: companyId },
  );
}
