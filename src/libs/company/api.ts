// @flow
//
import {
  getAuth,
  post,
  postAuth,
  buildUrlParams,
  API_V1_URI,
  putAuth,
} from '../../http';
import { AccountConfigurationStep } from './types';

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

export const retrieveStripeCompanyAPI = () => {
  return getAuth(
    `${API_V1_URI}/payment_backend/stripe/company/get_stripe_company_refreshed/`,
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

export const retrieveMyCompanySetup = () => {
  return postAuth(`${API_V1_URI}/company/setup/me/`);
};

export const validateAccountConfigurationStepAPI = ({
  step,
}: {
  step: AccountConfigurationStep;
}) => {
  return putAuth(
    `${API_V1_URI}/payment_backend/stripe/company/validate_step/`,
    {
      step,
    },
  );
};
