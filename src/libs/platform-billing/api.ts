// @flow

import { getAuth, postAuth, buildUrlParams, API_V1_URI } from '../../http';

export const fetchPlatformInvoiceList = async (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/platform_billing/platform_invoice/from_payment_backend/${buildUrlParams(
      params,
    )}`,
  );
};

export const payInvoice = async (payment_backend_id: string) => {
  return postAuth(`${API_V1_URI}/platform_billing/platform_invoice/bill_now/`, {
    payment_backend_id,
  });
};

export const retrievePlatformBillingPlanGroup = async () => {
  return getAuth(`${API_V1_URI}/platform_billing/billing_group/me/`);
};

export const fetchPlatformBillingPlanList = async (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/platform_billing/billing_plan/${buildUrlParams(params)}`,
  );
};

export const fetchPlatformBillingStageList = async (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/platform_billing/billing_stage/${buildUrlParams(params)}`,
  );
};

export const fetchUpsellPackageList = async (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/platform_billing/upsell_package/${buildUrlParams(params)}`,
  );
};
export const fetchUpsellPackageSubscribedList = async (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/platform_billing/upsell_package_subscribed/${buildUrlParams(
      params,
    )}`,
  );
};

export const retrieveSubscription = async () => {
  return getAuth(`${API_V1_URI}/platform_billing/platform_subscription/me/`);
};

export const requestUpsellPackage = async (upsell_identifier: number) => {
  return postAuth(
    `${API_V1_URI}/platform_billing/upsell_package/request_upsell_by_identifier/`,
    { upsell_identifier },
  );
};

export const checkPlatformSubscriptionSetup = async () => {
  return postAuth(
    `${API_V1_URI}/platform_billing/platform_subscription/check_setup/`,
  );
};

export const retrievePlatformSubscriptionPaymentStatusAPI = async () => {
  return getAuth(
    `${API_V1_URI}/platform_billing/platform_subscription/retrieve_payment_status/`,
  );
};
