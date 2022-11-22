import { AxiosResponse } from 'axios';

import { PaginatedResponse } from '../../state/types';
import {
  API_V1_URI,
  putAuth,
  postAuth,
  getAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';

import type { PrivatePass } from '#libs/private-service/types';

import type {
  PaymentComboPayload,
  FetchPaymentComboListParams,
  FetchPaymentComboPurchaseListParams,
  FetchPrivatePassListParams,
  PaymentCombo,
  PaymentComboPurchase,
} from './types';

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

// TODO : Clean duplicated api call :https://gitlab.com/bsport/bsport-saas/-/issues/1283
export const fetchPrivatePassList = (
  params?: FetchPrivatePassListParams,
): Promise<AxiosResponse<Array<PrivatePass>>> => {
  return getAuth(
    `${API_V1_URI}/private_service/private_pass/${buildUrlParams(params)}`,
  );
};
