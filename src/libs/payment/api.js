// @flow

import { API_V1_URI, getAuth, postAuth, buildUrlParams } from '../../http';

export const fetchPaymentMethodList = async (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/payment/payment_method/${buildUrlParams(params)}`,
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
