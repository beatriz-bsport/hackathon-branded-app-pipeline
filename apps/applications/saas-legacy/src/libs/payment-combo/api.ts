import { AxiosResponse } from 'axios';
import { PaginatedResponse } from '../../state/types';

import {
  putAuth,
  postAuth,
  getAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';

import type {
  PaymentComboPayload,
  FetchPaymentComboListParams,
  FetchPaymentComboPurchaseListParams,
  PaymentCombo,
  PaymentComboPurchase,
} from './types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BUYABLE_V1;

const PAYMENT_COMBO_ENDOINT = `${API_V1_URI}/payment_combo/`;
const PAYMENT_COMBO_PURCHASE_ENDOINT = `${API_V1_URI}/payment_combo_purchase/`;

export const fetchPaymentComboList = async (
  params: FetchPaymentComboListParams,
): Promise<AxiosResponse<Array<PaymentCombo>>> => {
  return getAuth(`${PAYMENT_COMBO_ENDOINT}${buildUrlParams(params)}`);
};
export const fetchPaymentComboPurchaseList = async (
  params: FetchPaymentComboPurchaseListParams,
): Promise<AxiosResponse<PaginatedResponse<PaymentComboPurchase[]>>> => {
  return getAuth(`${PAYMENT_COMBO_PURCHASE_ENDOINT}${buildUrlParams(params)}`);
};

export const retrievePaymentCombo = async (
  id: number,
): Promise<AxiosResponse<PaymentCombo>> => {
  return getAuth(`${PAYMENT_COMBO_ENDOINT}${id}/`);
};

/* New Endpoint : ../payment_combo/get_all/{params}
/* Allows to fetch disabled payment combos with their ids */
export const fetchSelectedPaymentCombos = async (params: {
  company: Number;
  id__in?: Number[];
}): Promise<AxiosResponse<PaginatedResponse<PaymentCombo>>> => {
  return getAuth(`${PAYMENT_COMBO_ENDOINT}get_all/${buildUrlParams(params)}`);
};

export const deletePaymentCombo = async (
  id: number,
): Promise<AxiosResponse<PaymentCombo>> => {
  return deleteAuth(`${PAYMENT_COMBO_ENDOINT}${id}/`);
};

export const createOrUpdatePaymentCombo = async (
  data: PaymentComboPayload,
): Promise<AxiosResponse<PaymentCombo>> => {
  if (data.id) {
    return putAuth(`${PAYMENT_COMBO_ENDOINT}${data.id}/`, data);
  }
  return postAuth(PAYMENT_COMBO_ENDOINT, data);
};

export const checkExpressCheckoutEligibility = async (
  paymentComboId: number,
) => {
  return postAuth(
    `${PAYMENT_COMBO_ENDOINT}${paymentComboId}/check_express_checkout_eligibility/`,
  );
};
