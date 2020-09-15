// @flow

import {
  API_V1_URI,
  getAuth,
  post,
  API_URI,
  postAuth,
  buildUrlParams,
} from '../../http';

export const fetchPaymentMethodList = async (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/payment/payment_method/${buildUrlParams(params)}`,
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
