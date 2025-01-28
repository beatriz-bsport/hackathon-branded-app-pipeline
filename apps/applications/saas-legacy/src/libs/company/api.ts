import type { Member } from '#src/libs/member/types';
import { AxiosResponse } from 'axios';
import { getAuth, postAuth, putAuth, post, buildUrlParams } from '../../http';
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
  PayPalCompany,
  GetPayPalOnboardingLinkParams,
} from './types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_CORE_V1;
const API_V1_URI_FS = Config.REACT_APP_BASE_URI_FINANCIAL_SERVICES_V1;

export const fetchCompanyList = (params: FetchCompanyListParams) => {
  return getAuth<Company[]>(
    `${API_V1_URI}/company/search/${buildUrlParams(params)}`,
  );
};

export const createCompany = (data: CompanyCreationParams) => {
  return post<StripeCompany>(`${API_V1_URI}/company/init/`, data);
};

export const getOnboardingLink = (data: GetOnboardingLinkParams) => {
  return postAuth<string>(
    `${API_V1_URI_FS}/payment_backend/stripe/company/get_onboarding_link/`,
    data,
  );
};

export const getPayPalOnboardingLink = (
  data?: GetPayPalOnboardingLinkParams,
): Promise<AxiosResponse<{ onboarding_url: string }>> => {
  return postAuth<{ onboarding_url: string }>(
    `${API_V1_URI_FS}/paypal/paypal-company/get_onboarding_link/`,
    data,
  );
};

export const retrieveStripeCompanyRefreshedAPI = () => {
  return getAuth<StripeCompany>(
    `${API_V1_URI_FS}/payment_backend/stripe/company/get_stripe_company_refreshed/`,
  );
};

export const retrieveStripeCompanyAPI = () => {
  return getAuth<StripeCompany>(
    `${API_V1_URI_FS}/payment_backend/stripe/company/me/`,
  );
};

export const attachExternalAccount = (token: string) => {
  return postAuth<StripeCompany>(
    `${API_V1_URI_FS}/payment_backend/stripe/company/attach_external_account/`,
    { external_account: token },
  );
};

export const getFeatureList = () => {
  return getAuth<FeatureList>(`${API_V1_URI}/company/features/`);
};

export const retrieveMyCompanySetup = () => {
  return postAuth<CompanySetup>(`${API_V1_URI}/company/setup/me/`);
};

export const checkNoOtherCompanyWithSamePayPalAccount = ({
  merchantId,
}: {
  merchantId: string;
}): Promise<AxiosResponse<void>> => {
  return postAuth<void>(
    `${API_V1_URI_FS}/paypal/paypal-company/check_no_other_company_with_same_account/`,
    { merchant_id: merchantId },
  );
};

export const retrievePayPalAccountStatusAPI = (): Promise<
  AxiosResponse<PayPalCompany>
> => {
  return getAuth<PayPalCompany>(
    `${API_V1_URI_FS}/paypal/paypal-company/validate_merchant_account_configuration/`,
  );
};

export const validateAccountConfigurationStepAPI = ({
  step,
}: {
  step: AccountConfigurationStep;
}) => {
  return putAuth<void>(
    `${API_V1_URI_FS}/payment_backend/stripe/company/validate_step/`,
    {
      step,
    },
  );
};

export const retrieveStripeAccountStatusAPI = async () => {
  return getAuth<StripeAccountStatus>(
    `${API_V1_URI_FS}/payment_backend/stripe/company/retrieve_stripe_account_status/`,
  );
};

export const retrievePOSMember = (companyId: number) => {
  return getAuth<Member>(`${API_V1_URI}/company/${companyId}/get_pos_member/`);
};
