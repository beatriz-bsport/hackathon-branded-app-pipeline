// @flow
import {
  API_V1_URI,
  putAuth,
  postAuth,
  getAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';

import type { PaymentComboPayload } from './types';

const PAYMENT_COMBO_ENDOINT = `${API_V1_URI}/payment_combo/`;
const PAYMENT_COMBO_PURCHASE_ENDOINT = `${API_V1_URI}/payment_combo_purchase/`;

export const fetchPaymentComboList = async (params: any) => {
  return getAuth(`${PAYMENT_COMBO_ENDOINT}${buildUrlParams(params)}`);
};
export const fetchPaymentComboPurchaseList = async (params: any) => {
  return getAuth(`${PAYMENT_COMBO_PURCHASE_ENDOINT}${buildUrlParams(params)}`);
};

export const retrievePaymentCombo = async (id: number) => {
  return getAuth(`${PAYMENT_COMBO_ENDOINT}${id}/`);
};

export const deletePaymentCombo = async (id: number) => {
  return deleteAuth(`${PAYMENT_COMBO_ENDOINT}${id}/`);
};

export const createOrUpdatePaymentCombo = async (data: PaymentComboPayload) => {
  if (data.id) {
    return putAuth(`${PAYMENT_COMBO_ENDOINT}${data.id}/`, data);
  }
  return postAuth(PAYMENT_COMBO_ENDOINT, data);
};

export const fetchPrivatePassList = (params?: any) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_pass/${buildUrlParams(params)}`,
  );
};
