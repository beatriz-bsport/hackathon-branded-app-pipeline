// @flow
//
import {
  getAuth,
  post,
  postAuth,
  buildUrlParams,
  API_V1_URI,
} from '../../http.ts';

export const fetchCompanyList = (params: any = {}) => {
  return getAuth(`${API_V1_URI}/company/search/${buildUrlParams(params)}`);
};

export const createCompany = (data: any) => {
  return post(`${API_V1_URI}/payment_backend/stripe/company/init/`, data);
};

export const getOnboardingLink = (data: any) => {
  return postAuth(
    `${API_V1_URI}/payment_backend/stripe/company/get_onboarding_link/`,
    data,
  );
};

export const attachExternalAccount = (token: string) => {
  return postAuth(
    `${API_V1_URI}/payment_backend/stripe/company/attach_external_account/`,
    { external_account: token },
  );
};

export const getFeatureList = () => {
  return getAuth(`${API_V1_URI}/company/features/`);
};
