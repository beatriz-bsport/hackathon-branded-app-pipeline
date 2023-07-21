import {
  postAuth,
  buildUrlParams,
  API_V1_URI,
  postAuthDeprecated,
  getAuthDeprecated,
  postDeprecated,
  putAuthDeprecated,
} from '../../http';
import { AccountConfigurationStep } from './types';

export const fetchCompanyList = (params: any = {}) => {
  return getAuthDeprecated(
    `${API_V1_URI}/company/search/${buildUrlParams(params)}`,
  );
};

export const createCompany = (data: any) => {
  return postDeprecated(
    `${API_V1_URI}/payment_backend/stripe/company/init/`,
    data,
  );
};

export const getOnboardingLink = (data: any) => {
  return postAuth(
    `${API_V1_URI}/payment_backend/stripe/company/get_onboarding_link/`,
    data,
  );
};

export const retrieveStripeCompanyRefreshedAPI = () => {
  return getAuthDeprecated(
    `${API_V1_URI}/payment_backend/stripe/company/get_stripe_company_refreshed/`,
  );
};

export const retrieveStripeCompanyAPI = () => {
  return getAuthDeprecated(`${API_V1_URI}/payment_backend/stripe/company/me/`);
};

export const attachExternalAccount = (token: string) => {
  return postAuthDeprecated(
    `${API_V1_URI}/payment_backend/stripe/company/attach_external_account/`,
    { external_account: token },
  );
};

export const getFeatureList = () => {
  return getAuthDeprecated(`${API_V1_URI}/company/features/`);
};

export const retrieveMyCompanySetup = () => {
  return postAuthDeprecated(`${API_V1_URI}/company/setup/me/`);
};

export const validateAccountConfigurationStepAPI = ({
  step,
}: {
  step: AccountConfigurationStep;
}) => {
  return putAuthDeprecated(
    `${API_V1_URI}/payment_backend/stripe/company/validate_step/`,
    {
      step,
    },
  );
};

export const retrieveStripeAccountStatusAPI = async () => {
  return getAuthDeprecated(
    `${API_V1_URI}/payment_backend/stripe/company/retrieve_stripe_account_status/`,
  );
};
