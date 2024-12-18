import {
  API_V1_URI,
  buildUrlParams,
  deleteAuth,
  getAuth,
  postAuth,
  putAuth,
} from '../../http';
import { InstalmentPaymentApi } from './types';

export const createInstalmentPayment = async (data: InstalmentPaymentApi) => {
  return postAuth(`${API_V1_URI}/payment/instalment-payment/`, data);
};

export const updateInstalmentPayment = async (data: InstalmentPaymentApi) => {
  return putAuth(`${API_V1_URI}/payment/instalment-payment/${data.id}/`, data);
};

export const deleteInstalmentPayment = async (id: number) => {
  return deleteAuth(`${API_V1_URI}/payment/instalment-payment/${id}/`);
};

export const fetchInstalmentPayment = async (params: {}) => {
  return getAuth(
    `${API_V1_URI}/payment/instalment-payment/${buildUrlParams(params)}`,
  );
};

export const fetchInstalmentPaymentByBasket = async (basketId: string) => {
  return getAuth(
    `${API_V1_URI}/checkout/basket/available_instalment_payments/?basket=${basketId}`,
  );
};
