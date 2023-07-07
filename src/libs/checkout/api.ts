import { AxiosResponse } from 'axios';
import {
  buildUrlParams,
  API_V1_URI,
  post,
  get,
  postAuth,
  putAuth,
  getAuth,
  patchAuth,
  deleteAuth,
} from '../../http';

import type {
  CheckoutItemData,
  Basket,
  BasketAddress,
  AddItemToBasketParams,
  QuicksaleMemberUpdateResponse,
} from './types';

export const fetchCurrentBasket = (
  companyId: number,
): Promise<{ data: Basket }> => {
  return postAuth(`${API_V1_URI}/checkout/basket/current/`, {
    company: companyId,
  });
};

export const addItemToBasket = (
  basketId: string,
  data: CheckoutItemData,
  params?: AddItemToBasketParams,
): Promise<{ data: Basket }> => {
  return putAuth(
    `${API_V1_URI}/checkout/basket/${basketId}/add_item/${buildUrlParams(
      params,
    )}`,
    {
      ...(data || {}),
      extra_data: data?.extra_data || {},
    },
  );
};

export const patchBasket = (
  basketId: string,
  data: BasketAddress,
): Promise<{ data: Basket }> => {
  return patchAuth(`${API_V1_URI}/checkout/basket/${basketId}/`, data);
};

export const removeItemFromBasket = (
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

export const attachPayment = (basketId: string, data_: any) => {
  return postAuth(
    `${API_V1_URI}/checkout/basket/${basketId}/attach_payment/`,
    data_,
  );
};

export const attachPaymentUnauthenticated = (basketId: string, data_: any) => {
  return post(
    `${API_V1_URI}/checkout/basket/${basketId}/attach_payment/`,
    data_,
  );
};

export const attachCoupon = (basketId: string, code: string) => {
  return postAuth(`${API_V1_URI}/checkout/basket/${basketId}/attach_coupon/`, {
    code,
  });
};

export const fetchBasketGeneratedObjects = (id: string) => {
  return postAuth(`${API_V1_URI}/checkout/basket/generated_objects/`, { id });
};

export const validateUnpaid = (basketId: string) => {
  return post(`${API_V1_URI}/checkout/basket/${basketId}/validate_unpaid/`);
};

export const fetchBasket = (
  basket: string,
): Promise<{ data: Basket<number> }> => {
  return get(`${API_V1_URI}/checkout/basket/by_uuid/?basket=${basket}`);
};

export const fetchBasketHistoryList = (
  memberId: number,
): Promise<{ data: Basket[] }> => {
  return getAuth(`${API_V1_URI}/checkout/basket/history/?member=${memberId}`);
};

export const createOrRefreshInternalAccountPrepaidLine = (
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

export const assignInstalmentPayment = (
  basketId: string,
  instalment_payment: number,
) => {
  return postAuth(`${API_V1_URI}/checkout/basket/assign_instalment_payment/`, {
    instalment_payment,
    id: basketId,
  });
};

export const fetchOpenQuicksaleBaskets = (): Promise<
  AxiosResponse<Basket[]>
> => {
  return getAuth(`${API_V1_URI}/checkout/basket/get_open_quicksale_baskets/`);
};

export const createQuicksaleBasket = (): Promise<AxiosResponse<Basket>> => {
  return postAuth(`${API_V1_URI}/checkout/basket/create_quicksale_basket/`);
};

export const updateQuicksaleBasketMember = (
  basketId: string,
  memberId: number,
): Promise<AxiosResponse<QuicksaleMemberUpdateResponse>> => {
  return putAuth(
    `${API_V1_URI}/checkout/basket/${basketId}/update_basket_member/`,
    {
      member: memberId,
    },
  );
};

export const dropQuicksaleBasket = (
  basketId: string,
): Promise<AxiosResponse<{ dropped: boolean }>> => {
  return deleteAuth(`${API_V1_URI}/checkout/basket/${basketId}/`);
};
