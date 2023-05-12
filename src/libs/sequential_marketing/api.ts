import { AxiosResponse } from 'axios';
import {
  API_V1_URI,
  getAuth,
  putAuth,
  postAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';

import { PaginatedResponse } from '../../state/types';

import { Cadence, CadenceQueryParams } from './types';

// CADENCE

export const retrieveCadence = async (
  id: number,
): Promise<AxiosResponse<Cadence>> => {
  return getAuth(`${API_V1_URI}/sequential_marketing/cadence/${id}/`);
};

export const fetchCadenceList = async (
  params: CadenceQueryParams,
): Promise<AxiosResponse<PaginatedResponse<Cadence>>> => {
  return getAuth(
    `${API_V1_URI}/sequential_marketing/cadence/${buildUrlParams(params)}`,
  );
};

export const createCadence = async ({
  name,
}: {
  name: string;
}): Promise<AxiosResponse<Cadence>> => {
  return postAuth(`${API_V1_URI}/sequential_marketing/cadence/`, {
    name,
  });
};

export const updateCadence = async (
  id: number,
  { name, priority_index }: { name?: string; priority_index?: number },
): Promise<AxiosResponse<Cadence>> => {
  return putAuth(`${API_V1_URI}/sequential_marketing/cadence/${id}/`, {
    name,
    priority_index,
  });
};

export const archiveCadence = async (
  id: number,
): Promise<AxiosResponse<Cadence>> => {
  return deleteAuth(`${API_V1_URI}/sequential_marketing/cadence/${id}/`);
};

export const restoreCadence = async (
  id: number,
): Promise<AxiosResponse<Cadence>> => {
  return postAuth(`${API_V1_URI}/sequential_marketing/cadence/${id}/restore/`);
};

export const activateCadence = async (
  id: number,
): Promise<AxiosResponse<Cadence>> => {
  return postAuth(`${API_V1_URI}/sequential_marketing/cadence/${id}/activate/`);
};

export const shutOffCadence = async (
  id: number,
): Promise<AxiosResponse<Cadence>> => {
  return postAuth(`${API_V1_URI}/sequential_marketing/cadence/${id}/shut_off/`);
};

export const setInitialCadenceConfiguration = async (
  id: number,
  data: any,
): Promise<AxiosResponse<Cadence>> => {
  return postAuth(
    `${API_V1_URI}/sequential_marketing/cadence/${id}/initial_config/`,
    {
      ...data,
    },
  );
};

export const patchInitialCadenceConfiguration = async (
  id: number,
  data: any,
): Promise<AxiosResponse<Cadence>> => {
  return putAuth(
    `${API_V1_URI}/sequential_marketing/cadence/${id}/initial_config/`,
    {
      ...data,
    },
  );
};
