import {
  getAuth,
  postAuth,
  putAuth,
  deleteAuth,
  buildUrlParams,
  patchAuth,
  post,
} from '../../http';
import type { MarketingNotification } from '#src/libs/marketing/types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_CDP_V1;

const MARKETING_ENDPOINT = `${API_V1_URI}/marketing`;

export const fetchMarketingNotificationList = async (params: any = {}) => {
  return getAuth(
    `${MARKETING_ENDPOINT}/marketing_notification/${buildUrlParams(params)}`,
  );
};

export const fetchMarketingNotification = async (id: number) => {
  return getAuth(`${MARKETING_ENDPOINT}/marketing_notification/${id}`);
};

export const createOrUpdateMarketingNotification = (data: any) => {
  if (data.id) {
    return putAuth(
      `${MARKETING_ENDPOINT}/marketing_notification/${data.id}/`,
      data,
    );
  }
  return postAuth(`${MARKETING_ENDPOINT}/marketing_notification/`, data);
};

export const deleteMarketingNotification = (id: number) => {
  return deleteAuth(`${MARKETING_ENDPOINT}/marketing_notification/${id}/`);
};

export const createMarketingNotification = (data: any) => {
  return postAuth(`${MARKETING_ENDPOINT}/marketing_notification/`, data);
};

export const updateMarketingNotification = (id: number, data: any) => {
  return patchAuth<MarketingNotification>(
    `${MARKETING_ENDPOINT}/marketing_notification/${id}/`,
    data,
  );
};

export const createNewsletterMember = (data: {
  email: string;
  company: number;
  first_name: string;
  last_name?: string;
  tag_id?: number;
  recaptcha?: string;
}) => {
  return post(`${MARKETING_ENDPOINT}/marketing_newsletter`, data);
};
