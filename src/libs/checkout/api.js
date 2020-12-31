// @flow

import { API_V1_URI, post, postAuth, putAuth, patchAuth } from '../../http';

import type { CheckoutItemData, Basket } from './types';

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
  data: *,
): Promise<{ data: Basket }> => {
  return patchAuth(`${API_V1_URI}/checkout/basket/${basketId}/`, data);
};

export const removeItemFromBasket = async (
  basketId: string,
  data: {
    checkout_item: string,
    quantity: number,
  },
): Promise<{ data: Basket }> => {
  return postAuth(
    `${API_V1_URI}/checkout/basket/${basketId}/remove_item/`,
    data,
  );
};

export const attachPayment = async (basketId: string, data_: *) => {
  return postAuth(
    `${API_V1_URI}/checkout/basket/${basketId}/attach_payment/`,
    data_,
  );
};

export const attachPaymentUnauthenticated = async (
  basketId: string,
  data_: *,
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
