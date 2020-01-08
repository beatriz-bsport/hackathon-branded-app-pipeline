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

const stop = async (id: number) => {
  return deleteAuth(`${API_URI}/subscription/billing-plan/${id}/stop/`);
};

const fetchContractList = async (params = {}) => {
  return getAuth(`${API_URI}/subscription/contract/${buildUrlParams(params)}`);
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

export default {
  fetchSubscriptionList: fetchAll,
  fetchDetail,
  createFromPack,
  stop,
  fetchContractList,
  createOrUpdateContract,
  deleteContract,
};
