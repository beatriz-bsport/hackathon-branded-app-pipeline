// @flow

import {
  API_URI,
  buildUrlParams,
  deleteAuth,
  getAuth,
  postAuth,
  post,
  patchAuth,
} from '../../http';

const fetchAll = async (params: any) => {
  return getAuth(
    `${API_URI}/subscription/billing-plan/${buildUrlParams(params)}`,
  );
};

const fetchDetail = async (id: number) => {
  return getAuth(`${API_URI}/subscription/billing-plan/${id}/`);
};

const createFromPack = async (data: *) => {
  return postAuth(
    `${API_URI}/subscription/billing-plan/create_from_pack/`,
    data,
  );
};

const stop = async (id: number, params: any) => {
  return deleteAuth(`${API_URI}/subscription/billing-plan/${id}/stop/`, params);
};

export const fetchPlannedInvoiceList = async (
  page: number,
  page_size: number,
  params: any = {},
) => {
  return getAuth(
    `${API_URI}/subscription/planned-invoice/${buildUrlParams({
      page,
      page_size,
      ...params,
    })}`,
  );
};

const fetchContractList = async (params: any = {}) => {
  return getAuth(`${API_URI}/subscription/contract/${buildUrlParams(params)}`);
};

export const fetchContractDetail = async (id: number) => {
  return getAuth(`${API_URI}/subscription/contract/${id}/`);
};

const createOrUpdateContract = async (data: any) => {
  if (data.id) {
    return patchAuth(`${API_URI}/subscription/contract/${data.id}/`, data);
  }
  return postAuth(`${API_URI}/subscription/contract/`, data);
};

const deleteContract = async (id: number) => {
  return deleteAuth(`${API_URI}/subscription/contract/${id}/`);
};

export const postContractSubscription = async (id: number, data: any) => {
  return postAuth(`${API_URI}/subscription/contract/${id}/register/`, data);
};

export const postContractSubscriptionUnauthenticated = async (
  id: number,
  data: any,
) => {
  return post(`${API_URI}/subscription/contract/${id}/register/`, data);
};

export const updatePlannedInvoicePrice = async (
  id: number,
  data: {
    planned_invoice: number,
    price: string,
  },
) => {
  return postAuth(
    `${API_URI}/subscription/billing-plan/${id}/update_price/`,
    data,
  );
};

export const updateSubscriptionRenewal = async (id: number, data: any) => {
  return postAuth(
    `${API_URI}/subscription/billing-plan/${id}/update_renewal/`,
    data,
  );
};

export const freezeSubscription = async (id: number, data: any) => {
  return postAuth(`${API_URI}/subscription/billing-plan/${id}/pause/`, data);
};

export const switchSubscriptionPaymentPack = async (
  id: number,
  data: { payment_pack: number },
) => {
  return postAuth(
    `${API_URI}/subscription/billing-plan/${id}/switch_payment_pack/`,
    data,
  );
};

export const switchSubscriptionPaymentMethod = async (
  id: number,
  data: { payment_method_identifier: number, source: string },
) => {
  return postAuth(
    `${API_URI}/subscription/billing-plan/${id}/switch_payment_provider/`,
    data,
  );
};

export default {
  fetchSubscriptionList: fetchAll,
  fetchDetail,
  createFromPack,
  stop,
  fetchContractList,
  createOrUpdateContract,
  deleteContract,
};
