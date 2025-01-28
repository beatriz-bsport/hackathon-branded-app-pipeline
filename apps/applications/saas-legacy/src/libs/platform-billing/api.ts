import {
  UpsellPackage,
  UpsellPackageSubscribedAPI,
} from '#src/libs/company/types';
import { getAuth, postAuth, buildUrlParams } from '../../http';

import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_FINANCIAL_SERVICES_V1;

export const fetchPlatformInvoiceList = (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/platform_billing/platform_invoice/from_payment_backend/${buildUrlParams(
      params,
    )}`,
  );
};

export const payInvoice = (payment_backend_id: string) => {
  return postAuth(`${API_V1_URI}/platform_billing/platform_invoice/bill_now/`, {
    payment_backend_id,
  });
};

export const retrievePlatformBillingPlanGroup = () => {
  return getAuth(`${API_V1_URI}/platform_billing/billing_group/me/`);
};

export const fetchPlatformBillingPlanList = (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/platform_billing/billing_plan/${buildUrlParams(params)}`,
  );
};

export const fetchPlatformBillingStageList = (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/platform_billing/billing_stage/${buildUrlParams(params)}`,
  );
};

/**
 * fetches the list of upsell packages.
 *
 * @param params - The query parameters.
 * @returns - A promise that resolves to an array of upsell packages.
 */
export const fetchUpsellPackages = (params: any = {}) => {
  return getAuth<UpsellPackage[]>(
    `${API_V1_URI}/platform_billing/upsell_package/${buildUrlParams(params)}`,
  );
};

/**
 * fetches the list of upsell packages that the company is subscribed to.
 *
 * @param params - The query parameters.
 * @returns - A promise that resolves to an array of UpsellPackageSubscribedAPI objects.
 */
export const fetchUpsellPackageSubscribedIds = (params: any = {}) => {
  return getAuth<UpsellPackageSubscribedAPI[]>(
    `${API_V1_URI}/platform_billing/upsell_package_subscribed/${buildUrlParams(
      params,
    )}`,
  );
};

export const retrieveSubscription = () => {
  return getAuth(`${API_V1_URI}/platform_billing/platform_subscription/me/`);
};

export const requestUpsellPackage = (upsell_identifier: number) => {
  return postAuth<UpsellPackage>(
    `${API_V1_URI}/platform_billing/upsell_package/request_upsell_by_identifier/`,
    { upsell_identifier },
  );
};

/**
 * Subscribes to an upsell package directly form the backoffice.
 *
 * @param id - The id of the upsell package.
 * @returns - A promise that resolves to an object containing the subscribed upsell package and the upsell package details.
 */
export const subscribeUpsellPackage = (id: number) => {
  return postAuth<{
    upsell_package_subscribed: UpsellPackageSubscribedAPI;
    upsell_package: UpsellPackage;
  }>(`${API_V1_URI}/platform_billing/upsell_package/${id}/subscribe/`);
};

export const checkPlatformSubscriptionSetup = () => {
  return postAuth(
    `${API_V1_URI}/platform_billing/platform_subscription/check_setup/`,
  );
};

export const retrievePlatformSubscriptionPaymentStatusAPI = () => {
  return getAuth(
    `${API_V1_URI}/platform_billing/platform_subscription/retrieve_payment_status/`,
  );
};
