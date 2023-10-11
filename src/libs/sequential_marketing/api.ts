import type { AxiosResponse } from 'axios';
import type { PaginatedResponse } from '../../state/types';
import type {
  Cadence,
  CadenceStep,
  ConnectedTrigger,
  StepMarketingActionsParams,
  CadenceStepQueryParams,
  CadenceQueryParams,
  StepMarketingActions,
} from './types';

import {
  API_V1_URI,
  getAuth,
  putAuth,
  postAuth,
  deleteAuth,
  patchAuth,
  buildUrlParams,
} from '../../http';

// CADENCE

export const retrieveCadence = (id: number) => {
  return getAuth<Cadence>(`${API_V1_URI}/sequential_marketing/cadence/${id}/`);
};

export const fetchCadenceList = (params: CadenceQueryParams) => {
  return getAuth<PaginatedResponse<Cadence>>(
    `${API_V1_URI}/sequential_marketing/cadence/${buildUrlParams(params)}`,
  );
};

export const createCadence = ({ name }: { name: string }) => {
  return postAuth<Cadence>(`${API_V1_URI}/sequential_marketing/cadence/`, {
    name,
  });
};

export const updateCadence = (
  id: number,
  { name, priority_index }: { name?: string; priority_index?: number },
) => {
  return putAuth<Cadence>(`${API_V1_URI}/sequential_marketing/cadence/${id}/`, {
    name,
    priority_index,
  });
};

export const archiveCadence = (id: number) => {
  return deleteAuth<Cadence>(
    `${API_V1_URI}/sequential_marketing/cadence/${id}/`,
  );
};

export const restoreCadence = (id: number) => {
  return postAuth<Cadence>(
    `${API_V1_URI}/sequential_marketing/cadence/${id}/restore/`,
  );
};

export const activateCadence = (id: number) => {
  return postAuth<Cadence>(
    `${API_V1_URI}/sequential_marketing/cadence/${id}/activate/`,
  );
};

export const shutOffCadence = (id: number) => {
  return postAuth<Cadence>(
    `${API_V1_URI}/sequential_marketing/cadence/${id}/shut_off/`,
  );
};

export const setInitialCadenceConfiguration = (id: number, data: any) => {
  return postAuth<Cadence>(
    `${API_V1_URI}/sequential_marketing/cadence/${id}/initial_config/`,
    {
      ...data,
    },
  );
};

export const patchInitialCadenceConfiguration = (id: number, data: any) => {
  return putAuth<Cadence>(
    `${API_V1_URI}/sequential_marketing/cadence/${id}/initial_config/`,
    {
      ...data,
    },
  );
};

export const retrieveCadenceStep = (id: number) => {
  return getAuth<CadenceStep>(
    `${API_V1_URI}/sequential_marketing/cadence_step/${id}`,
  );
};

export const fetchCadenceStepList = (params: CadenceStepQueryParams) => {
  return getAuth<PaginatedResponse<CadenceStep>>(
    `${API_V1_URI}/sequential_marketing/cadence_step/${buildUrlParams(params)}`,
  );
};

export const updateCadenceStepCanvasPosition = (
  id: number,
  { x, y }: { x: number; y: number },
) => {
  return postAuth<CadenceStep>(
    `${API_V1_URI}/sequential_marketing/cadence_step/${id}/set_position/`,
    {
      x,
      y,
    },
  );
};

export const updateCadenceStepConnectedTriggerCanvasPosition = (
  id: number,
  { ct_uuid, x, y }: { ct_uuid: string; x: number; y: number },
) => {
  return postAuth<CadenceStep>(
    `${API_V1_URI}/sequential_marketing/cadence/${id}/connected_trigger/${ct_uuid}/set_position/`,
    {
      ct_uuid,
      x,
      y,
    },
  );
};

export const updateCadenceStep = (id: number, { name }: { name: string }) => {
  return putAuth<CadenceStep>(
    `${API_V1_URI}/sequential_marketing/cadence_step/${id}/`,
    {
      name,
    },
  );
};

export const deleteCadenceStep = (id: number) => {
  return deleteAuth<CadenceStep>(
    `${API_V1_URI}/sequential_marketing/cadence_step/${id}/`,
  );
};

export const subscribeStepToStep = (
  cadenceId: number,
  data: {
    connected_trigger: ConnectedTrigger;
    step: Pick<CadenceStep, 'id' | 'name' | 'canvas'>;
  },
) => {
  return postAuth<{
    step: CadenceStep;
    connected_trigger: ConnectedTrigger;
  }>(
    `${API_V1_URI}/sequential_marketing/cadence/${cadenceId}/connected_trigger/`,
    {
      ...data,
    },
  );
};

export const modifyStepMarketingActionsConfiguration = (
  step_id: number,
  list: StepMarketingActions[],
) => {
  return postAuth<{ result: StepMarketingActions[]; disabled: number[] }>(
    `${API_V1_URI}/sequential_marketing/cadence_step/${step_id}/modify_marketing_actions_configuration/`,
    list,
  );
};

// Connected Triggers

export const updateConnectedTrigger = (
  cadenceId: number,
  connectedTriggerUUID: string,
  connectedTrigger: ConnectedTrigger,
) => {
  return putAuth<ConnectedTrigger>(
    `${API_V1_URI}/sequential_marketing/cadence/${cadenceId}/connected_trigger/${connectedTriggerUUID}/`,
    connectedTrigger,
  );
};

export const deleteConnectedTrigger = (
  cadenceId: number,
  connectedTriggerUUID: string,
): Promise<AxiosResponse> => {
  return deleteAuth(
    `${API_V1_URI}/sequential_marketing/cadence/${cadenceId}/connected_trigger/${connectedTriggerUUID}/`,
  );
};

// MarketingActions

export const fetchMarketingActions = (params: StepMarketingActionsParams) => {
  return getAuth<PaginatedResponse<StepMarketingActions>>(
    `${API_V1_URI}/sequential_marketing/cadence_marketing_action/${buildUrlParams(
      params,
    )}`,
  );
};

export const createStepMarketingAction = (data: StepMarketingActions) => {
  return postAuth<StepMarketingActions>(
    `${API_V1_URI}/sequential_marketing/cadence_marketing_action/`,
    data,
  );
};

export const deleteStepMarketingAction = (id: number) => {
  return deleteAuth<StepMarketingActions>(
    `${API_V1_URI}/sequential_marketing/cadence_marketing_action/${id}/`,
  );
};

export const updateStepMarketingAction = (
  id: number,
  data: StepMarketingActions,
) => {
  return patchAuth<StepMarketingActions>(
    `${API_V1_URI}/sequential_marketing/cadence_marketing_action/${id}/`,
    data,
  );
};
