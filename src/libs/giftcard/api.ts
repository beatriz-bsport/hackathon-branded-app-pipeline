import { AxiosResponse } from 'axios';
import {
  API_V1_URI,
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';
import { Giftcard, ConsumerGiftcard, GiftcardBackgroundImage } from './types';

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
  params: any,
): Promise<AxiosResponse<Array<ConsumerGiftcard>>> => {
  return getAuth(
    `${API_V1_URI}/giftcard/consumer_giftcard/${buildUrlParams(params)}`,
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

export const attributeMember = (
  id: number,
  data: any,
): Promise<AxiosResponse<ConsumerGiftcard>> => {
  return postAuth(
    `${API_V1_URI}/giftcard/consumer_giftcard/${id}/attribute_to_member/`,
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
