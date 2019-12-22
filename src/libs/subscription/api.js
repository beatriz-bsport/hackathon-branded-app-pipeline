// @flow

import {
  API_URI,
  buildUrlParams,
  deleteAuth,
  getAuth,
  postAuth,
  patchAuth,
} from '../../http';

const fetchAll = async (params) => {
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

export default {
  fetchSubscriptionList: fetchAll,
  fetchDetail,
  createFromPack,
  stop,
  fetchContractList,
  createOrUpdateContract,
  deleteContract,
};
