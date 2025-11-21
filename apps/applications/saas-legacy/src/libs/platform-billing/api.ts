import {
  UpsellPackage,
  UpsellPackageSubscribedAPI,
} from '#src/libs/company/types';
import { getAuth, postAuth, patchAuth, buildUrlParams } from '#src/http';

import Config from '../../config';
import type { PaginatedResponse } from '#src/state/types';
import {
  PlatformCustomerEntity,
  PlatformCustomerEntityRepresentative,
  PlatformCustomerEntityRepresentativeInput,
  UpdatePlatformCustomerEntityVatInformationParams,
} from '#src/libs/platform-billing/type';

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
 * Fetches the platform customer entity related to the authenticated manager
 *
 * @returns - A promise that resolves to a PlatformCustomerEntity object.
 */
export const fetchPlatformCustomerEntity = () => {
  return getAuth<PlatformCustomerEntity>(
    `${API_V1_URI}/platform_billing/platform_customer_entity/me/`,
  );
};

/**
 * Update the VAT id information of platform customer entity related to the authenticated manager
 *
 * @param params - The query parameters:
 *      - vat_id: a string corresponding to the customer VAT id. (optional)
 *      - has_attributed_vat_id: a boolean indicating whether the customer has an attributed VAT id. (required)
 */

export const updatePlatformCustomerEntityVatInformation = (
  params: UpdatePlatformCustomerEntityVatInformationParams,
) => {
  return patchAuth(
    `${API_V1_URI}/platform_billing/platform_customer_entity/me/update_vat_information/`,
    {
      ...(params?.vatId && { vat_id: params.vatId }),
      has_attributed_vat_id: params.hasAttributedVatId,
    },
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

/**
 * Fetches the list of platform customer entity representatives for the authenticated manager's company.
 *
 * @returns - A promise that resolves to an array of PlatformCustomerEntityRepresentative objects.
 */
export const fetchPlatformCustomerEntityRepresentatives = () => {
  return getAuth<PaginatedResponse<PlatformCustomerEntityRepresentative>>(
    `${API_V1_URI}/platform_billing/platform_customer_entity_representative/`,
  );
};

/**
 * Creates a new platform customer entity representative for the authenticated manager's company.
 *
 * @param data - The representative data to create.
 * @returns - A promise that resolves to the created PlatformCustomerEntityRepresentative object.
 */
export const createPlatformCustomerEntityRepresentative = (
  data: PlatformCustomerEntityRepresentativeInput,
) => {
  return postAuth<PlatformCustomerEntityRepresentative>(
    `${API_V1_URI}/platform_billing/platform_customer_entity_representative/`,
    data,
  );
};

/**
 * Partially updates a platform customer entity representative.
 *
 * @param id - The id of the representative to update.
 * @param data - The partial representative data to update.
 * @returns - A promise that resolves to the updated PlatformCustomerEntityRepresentative object.
 */
export const updatePlatformCustomerEntityRepresentative = (
  id: number,
  data: Partial<PlatformCustomerEntityRepresentativeInput>,
) => {
  return patchAuth<PlatformCustomerEntityRepresentative>(
    `${API_V1_URI}/platform_billing/platform_customer_entity_representative/${id}/`,
    data,
  );
};
