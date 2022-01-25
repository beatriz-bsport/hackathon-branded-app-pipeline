import {
  API_V1_URI,
  post,
  get,
  postAuth,
  putAuth,
  getAuth,
  patchAuth,
} from '../../http';

import { CheckoutItemData, Basket } from './types';

export const fetchCurrentBasket = async (
  companyId: number,
): Promise<{ data: Basket }> => {
  return postAuth(`${API_V1_URI}/checkout/basket/current/`, {
    company: companyId,
  });
};

export const addItemToBasket = async (
  basketId: string,
  data: CheckoutItemData,
): Promise<{ data: Basket }> => {
  return putAuth(`${API_V1_URI}/checkout/basket/${basketId}/add_item/`, data);
};

export const patchBasket = async (
  basketId: string,
  data: any,
): Promise<{ data: Basket }> => {
  return patchAuth(`${API_V1_URI}/checkout/basket/${basketId}/`, data);
};

export const removeItemFromBasket = async (
  basketId: string,
  data: {
    checkout_item: string;
    quantity: number;
  },
): Promise<{ data: Basket }> => {
  return postAuth(
    `${API_V1_URI}/checkout/basket/${basketId}/remove_item/`,
    data,
  );
};

export const attachPayment = async (basketId: string, data_: any) => {
  return postAuth(
    `${API_V1_URI}/checkout/basket/${basketId}/attach_payment/`,
    data_,
  );
};

export const attachPaymentUnauthenticated = async (
  basketId: string,
  data_: any,
) => {
  return post(
    `${API_V1_URI}/checkout/basket/${basketId}/attach_payment/`,
    data_,
  );
};

export const attachCoupon = async (basketId: string, code: string) => {
  return postAuth(`${API_V1_URI}/checkout/basket/${basketId}/attach_coupon/`, {
    code,
  });
};

export const fetchBasketGeneratedObjects = async (id: string) => {
  return postAuth(`${API_V1_URI}/checkout/basket/generated_objects/`, { id });
};

export const validateUnpaid = async (basketId: string) => {
  return post(`${API_V1_URI}/checkout/basket/${basketId}/validate_unpaid/`);
};

export const fetchBasket = async (
  basket: string,
): Promise<{ data: Basket<number> }> => {
  return get(`${API_V1_URI}/checkout/basket/by_uuid/?basket=${basket}`);
};

export const fetchBasketHistoryList = async (
  memberId: number,
): Promise<{ data: Array<Basket> }> => {
  return getAuth(`${API_V1_URI}/checkout/basket/history/?member=${memberId}`);
};

export const createOrRefreshInternalAccountPrepaidLine = async (
  basket_uuid: string,
  amount: number,
): Promise<{ data: Basket }> => {
  return postAuth(
    `${API_V1_URI}/checkout/basket/${basket_uuid}/create_prepaid_line_from_bsport_account/`,
    {
      amount,
    },
  );
};

export const assignInstalmentPayment = async (
  basketId: string,
  instalment_payment: number,
) => {
  return postAuth(`${API_V1_URI}/checkout/basket/assign_instalment_payment/`, {
    instalment_payment,
    id: basketId,
  });
};
