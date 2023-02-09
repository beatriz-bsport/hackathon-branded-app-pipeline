import { AxiosResponse } from 'axios';
import {
  API_V1_URI,
  getAuth,
  putAuth,
  postAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';

import {
  Cadence,
  CadenceStep,
  CadenceQueryParams,
  CadenceStepQueryParams,
} from './types';

import { PaginatedResponse } from '../../state/types';
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
  { name }: { name: string },
): Promise<AxiosResponse<Cadence>> => {
  return putAuth(`${API_V1_URI}/sequential_marketing/cadence/${id}/`, {
    name,
  });
};

export const archiveCadence = async (
  id: number,
): Promise<AxiosResponse<Cadence>> => {
  return postAuth(`${API_V1_URI}/sequential_marketing/cadence/${id}/archive/`);
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

export const upsertCadenceConfiguration = async (
  id: number,
  data: any,
): Promise<AxiosResponse<Cadence>> => {
  return postAuth(
    `${API_V1_URI}/sequential_marketing/cadence/${id}/set_configuration/`,
    {
      ...data,
    },
  );
};

// CADENCE STEP
export const retrieveCadenceStep = async (
  id: number,
): Promise<AxiosResponse<CadenceStep>> => {
  return getAuth(`${API_V1_URI}/sequential_marketing/cadence_step/${id}`);
};

export const fetchCadenceStepList = async (
  params: CadenceStepQueryParams,
): Promise<AxiosResponse<PaginatedResponse<CadenceStep>>> => {
  return getAuth(
    `${API_V1_URI}/sequential_marketing/cadence_step/${buildUrlParams(params)}`,
  );
};

export const updateCadenceStepCanvasPosition = async (
  id: number,
  { x, y }: { x: number; y: number },
): Promise<AxiosResponse<CadenceStep>> => {
  return postAuth(
    `${API_V1_URI}/sequential_marketing/cadence_step/${id}/update_position/`,
    {
      x,
      y,
    },
  );
};

export const updateCadenceStepConnectedTriggerCanvasPosition = async (
  id: number,
  { ct_uuid, x, y }: { ct_uuid: string; x: number; y: number },
): Promise<AxiosResponse<CadenceStep>> => {
  return postAuth(
    `${API_V1_URI}/sequential_marketing/cadence_step/${id}/update_trigger_position/`,
    {
      ct_uuid,
      x,
      y,
    },
  );
};

export const updateCadenceStep = async (
  id: number,
  { name }: { name: string },
): Promise<AxiosResponse<Cadence>> => {
  return putAuth(`${API_V1_URI}/sequential_marketing/cadence_step/${id}/`, {
    name,
  });
};

export const deleteCadenceStep = async (
  id: number,
): Promise<AxiosResponse<Cadence>> => {
  return deleteAuth(`${API_V1_URI}/sequential_marketing/cadence_step/${id}/`);
};

export const subscribeStepToStep = async (
  id: number,
  data: any,
): Promise<AxiosResponse<CadenceStep>> => {
  return postAuth(
    `${API_V1_URI}/sequential_marketing/cadence_step/${id}/subscribe_to_step/`,
    {
      ...data,
    },
  );
};

export const updateConnectedTrigger = async (
  id: number,
  data: any,
): Promise<AxiosResponse<CadenceStep>> => {
  return postAuth(
    `${API_V1_URI}/sequential_marketing/cadence_step/${id}/update_connected_trigger/`,
    {
      ...data,
    },
  );
};
