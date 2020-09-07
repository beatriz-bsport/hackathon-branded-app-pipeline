// @flow

import { getAuth, buildUrlParams, API_V1_URI } from '../../http';

export const fetchPlatformInvoiceList = async (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/platform_billing/platform_invoice/${buildUrlParams(params)}`,
  );
};
