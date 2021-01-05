import {
  getAuth,
  postAuth,
  putAuth,
  deleteAuth,
  buildUrlParams,
  patchAuth,
  API_V1_URI,
  post,
} from '../../http';

const MARKETING_ENDPOINT = `${API_V1_URI}/marketing`;

export const fetchMarketingNotification = async (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/marketing/marketing_notification/${buildUrlParams(params)}`,
  );
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
  return patchAuth(`${MARKETING_ENDPOINT}/marketing_notification/${id}/`, data);
};

export const createNewsletterMember = (data: {
  email: string;
  company: number;
  first_name: string;
  last_name?: string;
}) => {
  return post(`${MARKETING_ENDPOINT}/marketing_newsletter`, data);
};
