// @flow

import { API_V1_URI, getAuth, patchAuth, postAuth } from '../../http';

export const fetchZoomApp = async (companyId: number) => {
  return getAuth(`${API_V1_URI}/zoom_app/company/${companyId}/`);
};

export const updateZoomApp = (companyId: number, data: any) => {
  return patchAuth(`${API_V1_URI}/zoom_app/company/${companyId}/`, data);
};

export const requestZoomAccessToken = (companyId, code, redirect_uri) => {
  return postAuth(
    `${API_V1_URI}/zoom_app/company/${companyId}/request_access_token/`,
    {
      code,
      redirect_uri,
    },
  );
};
