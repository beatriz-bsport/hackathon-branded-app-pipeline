// @flow

import {
  API_V1_URI,
  getAuth,
  post,
  API_URI,
  postAuth,
  buildUrlParams,
  putAuth,
} from '../../http';

export const fetchPaymentMethodList = async (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/payment/payment_method/${buildUrlParams(params)}`,
  );
};
export const detachPaymentMetod = async (params: any = {}) => {
  return putAuth(
    `${API_V1_URI}/payment/payment_method/detach_payment_method/${buildUrlParams(
      params,
    )}`,
  );
};
export const fetchOnSpotPaymentReport = async (params: any = {}) => {
  return getAuth(
    `${API_URI}/reporting/on-spot-payment/${buildUrlParams(params)}`,
  );
};

export const requestSetupIntentSecret = async (
  member: ?number,
  company: ?number,
  as_company?: boolean = false,
) => {
  return postAuth(
    `${API_V1_URI}/payment/payment_method/register_setup_intent/`,
    {
      member,
      company,
      as_company,
    },
  );
};

export const requestSetupIntentSecretNoAuth = async (
  member: ?number,
  company: ?number,
  as_company?: boolean = false,
) => {
  return post(`${API_V1_URI}/payment/payment_method/register_setup_intent/`, {
    member,
    company,
    as_company,
  });
};

export const submitInternalPayment = async (data: any) => {
  return postAuth(`${API_V1_URI}/payment/internal_payment/`, data);
};

export const getPaymentGroupStatus = async (id: number) => {
  return getAuth(`${API_V1_URI}/payment/payment_group/${id}/status/`);
};

export const setBillingEstablishmentOnCompletedPaymentGroupStatus = async (
  paymentGroupId: number,
  establishmentId: number,
) => {
  return postAuth(
    `${API_V1_URI}/payment/payment_group/set_billing_establishment/`,
    {
      payment_group_id: paymentGroupId,
      establishment_id: establishmentId,
    },
  );
};
export const getPaymentGroupStatusBySecret = async (
  _payment_backend_id: string,
) => {
  return postAuth(`${API_V1_URI}/payment/payment_group/status_by_secret/`, {
    _payment_backend_id,
  });
};

export const fetchPaymentGroupList = async (params: any) => {
  return getAuth(
    `${API_V1_URI}/payment/payment_group/${buildUrlParams(params)}`,
  );
};

export const fetchPayoutList = async (params: any) => {
  return getAuth(`${API_V1_URI}/payment/payout/${buildUrlParams(params)}`);
};

export const updatePaymentGroupPriceCts = async (
  id: number,
  price_cts: number,
) => {
  return postAuth(`${API_V1_URI}/payment/payment_group/${id}/update_price/`, {
    price_cts,
  });
};

export const verifyPriceBasket = async (basketId: string) => {
  return postAuth(`${API_V1_URI}/checkout/basket/${basketId}/verify_price/`);
};
