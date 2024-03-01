import {
  getAuth,
  postAuth,
  putAuth,
  post,
  buildUrlParams,
  API_V1_URI,
} from '../../http';
import type {
  AccountConfigurationStep,
  Company,
  CompanyCreationParams,
  FetchCompanyListParams,
  CompanySetup,
  FeatureList,
  GetOnboardingLinkParams,
  StripeAccountStatus,
  StripeCompany,
} from './types';
import type { Member } from '#libs/member/types';

export const fetchCompanyList = (params: FetchCompanyListParams) => {
  return getAuth<Company[]>(
    `${API_V1_URI}/company/search/${buildUrlParams(params)}`,
  );
};

export const createCompany = (data: CompanyCreationParams) => {
  return post<StripeCompany>(
    `${API_V1_URI}/payment_backend/stripe/company/init/`,
    data,
  );
};

export const getOnboardingLink = (data: GetOnboardingLinkParams) => {
  return postAuth<string>(
    `${API_V1_URI}/payment_backend/stripe/company/get_onboarding_link/`,
    data,
  );
};

export const retrieveStripeCompanyRefreshedAPI = () => {
  return getAuth<StripeCompany>(
    `${API_V1_URI}/payment_backend/stripe/company/get_stripe_company_refreshed/`,
  );
};

export const retrieveStripeCompanyAPI = () => {
  return getAuth<StripeCompany>(
    `${API_V1_URI}/payment_backend/stripe/company/me/`,
  );
};

export const attachExternalAccount = (token: string) => {
  return postAuth<StripeCompany>(
    `${API_V1_URI}/payment_backend/stripe/company/attach_external_account/`,
    { external_account: token },
  );
};

export const getFeatureList = () => {
  return getAuth<FeatureList>(`${API_V1_URI}/company/features/`);
};

export const retrieveMyCompanySetup = () => {
  return postAuth<CompanySetup>(`${API_V1_URI}/company/setup/me/`);
};

export const validateAccountConfigurationStepAPI = ({
  step,
}: {
  step: AccountConfigurationStep;
}) => {
  return putAuth<void>(
    `${API_V1_URI}/payment_backend/stripe/company/validate_step/`,
    {
      step,
    },
  );
};

export const retrieveStripeAccountStatusAPI = async () => {
  return getAuth<StripeAccountStatus>(
    `${API_V1_URI}/payment_backend/stripe/company/retrieve_stripe_account_status/`,
  );
};

export const retrievePOSMember = (companyId: number) => {
  return getAuth<Member>(`${API_V1_URI}/company/${companyId}/get_pos_member/`);
};
