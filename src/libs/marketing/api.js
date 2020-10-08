// @flow

import { getAuth, postAuth, putAuth, deleteAuth, API_V1_URI } from '../../http';

const MARKETING_ENDPOINT = `${API_V1_URI}/marketing`;

export const fetchMarketingNotification = async () => {
  return getAuth(`${API_V1_URI}/marketing/marketing_notification/`);
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
