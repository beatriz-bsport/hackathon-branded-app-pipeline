// @ts-nocheck
import { AxiosResponse } from 'axios';
import {
  API_V1_URI,
  getAuth,
  putAuth,
  postAuth,
  deleteAuth,
  buildUrlParams,
  patchAuth,
} from '../../http';

import {
  Cadence,
  CadenceStep,
  CadenceQueryParams,
  CadenceStepQueryParams,
  StepMarketingActions,
  StepMarketinActionsParams,
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
    `${API_V1_URI}/sequential_marketing/cadence_step/${id}/set_position/`,
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
    `${API_V1_URI}/sequential_marketing/cadence/${id}/connected_trigger/${ct_uuid}/set_position/`,
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
  cadenceId: number,
  id: number,
  data: any,
): Promise<AxiosResponse<CadenceStep>> => {
  return postAuth(
    `${API_V1_URI}/sequential_marketing/cadence/${cadenceId}/connected_trigger/`,
    {
      ...data,
    },
  );
};

// Connected Triggers

export const updateConnectedTrigger = async (
  cadenceId: number,
  connectedTriggerUUID: string,
  data: any,
): Promise<AxiosResponse<CadenceStep>> => {
  return putAuth(
    `${API_V1_URI}/sequential_marketing/cadence/${cadenceId}/connected_trigger/${connectedTriggerUUID}/`,
    {
      ...data,
    },
  );
};

export const deleteConnectedTrigger = async (
  cadenceId: number,
  connectedTriggerUUID: string,
): Promise<AxiosResponse> => {
  return deleteAuth(
    `${API_V1_URI}/sequential_marketing/cadence/${cadenceId}/connected_trigger/${connectedTriggerUUID}/`,
  );
};

// MarketingActions

export const fetchMarketingActions = async (
  params: StepMarketinActionsParams,
): Promise<AxiosResponse<PaginatedResponse<StepMarketingActions>>> => {
  return getAuth(
    `${API_V1_URI}/sequential_marketing/cadence_marketing_action/${buildUrlParams(
      params,
    )}`,
  );
};

export const createStepMarketingAction = async (
  data: StepMarketingActions,
): Promise<AxiosResponse<StepMarketingActions>> => {
  return postAuth(
    `${API_V1_URI}/sequential_marketing/cadence_marketing_action/`,
    data,
  );
};

export const deleteStepMarketingAction = async (
  id: number,
): Promise<AxiosResponse<StepMarketingActions>> => {
  return deleteAuth(
    `${API_V1_URI}/sequential_marketing/cadence_marketing_action/${id}/`,
  );
};

export const updateStepMarketingAction = async (
  id: number,
  data: StepMarketingActions,
): Promise<AxiosResponse<PaginatedResponse<StepMarketingActions>>> => {
  return patchAuth(
    `${API_V1_URI}/sequential_marketing/cadence_marketing_action/${id}/`,
    data,
  );
};
