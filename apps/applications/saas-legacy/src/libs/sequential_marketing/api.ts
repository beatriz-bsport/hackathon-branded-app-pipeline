import type { AxiosResponse } from 'axios';
import type { PaginatedResponse } from '../../state/types';
import type {
  Cadence,
  CadenceQueryParams,
  CadenceStep,
  CadenceStepQueryParams,
  ConnectedTrigger,
  GraphCanvas,
  CadenceInitialConfiguration,
  StepMarketingActions,
  StepMarketingActionsParams,
  UpdatedTrigger,
  UpdatedTriggersList,
  CadenceGlobalMetrics,
  CadenceMembersInData,
  CadenceMembersOutData,
  CadencePaginatedMetricsParams,
  CadenceGlobalMetricsParams,
  MetricsPaginatedResponse,
} from './types';
import type { CadenceConfigData } from './cadence_templates/types';

import { InitialConfigurationStep, DestinationStatus } from './constants';

import {
  getAuth,
  putAuth,
  postAuth,
  deleteAuth,
  patchAuth,
  buildUrlParams,
} from '../../http';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_CDP_V1;

// CADENCE

export const retrieveCadence = (id: number) => {
  return getAuth<Cadence>(`${API_V1_URI}/sequential_marketing/cadence/${id}/`);
};

export const fetchCadenceList = (params: CadenceQueryParams) => {
  return getAuth<PaginatedResponse<Cadence>>(
    `${API_V1_URI}/sequential_marketing/cadence/${buildUrlParams(params)}`,
  );
};

export const createCadence = ({
  name,
  is_multiple_visit_allowed,
}: {
  name: string;
  is_multiple_visit_allowed?: boolean;
}) => {
  return postAuth<Cadence>(`${API_V1_URI}/sequential_marketing/cadence/`, {
    name,
    is_multiple_visit_allowed,
  });
};

export const updateCadence = (
  id: number,
  {
    name,
    priority_index,
    is_multiple_visit_allowed,
  }: {
    name?: string;
    priority_index?: number;
    is_multiple_visit_allowed?: boolean;
  },
) => {
  return putAuth<Cadence>(`${API_V1_URI}/sequential_marketing/cadence/${id}/`, {
    name,
    priority_index,
    is_multiple_visit_allowed,
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

export const duplicateCadence = (id: number) => {
  return postAuth<Cadence>(
    `${API_V1_URI}/sequential_marketing/cadence/${id}/duplicate/`,
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

export const setCadenceInitialConfiguration = (
  id: number,
  data: CadenceInitialConfiguration,
) => {
  return postAuth<Cadence>(
    `${API_V1_URI}/sequential_marketing/cadence/${id}/initial_config/`,
    {
      entry_list:
        data[InitialConfigurationStep.CADENCE_ENTRY_STEP].connectedTriggers,
      win_exit_list:
        data[InitialConfigurationStep.CADENCE_WIN_STEP].connectedTriggers,
      lose_exit_list:
        data[InitialConfigurationStep.CADENCE_LOSE_STEP].connectedTriggers,
    },
  );
};

export const patchCadenceInitialConfiguration = (
  id: number,
  data: CadenceInitialConfiguration,
) => {
  return putAuth<Cadence>(
    `${API_V1_URI}/sequential_marketing/cadence/${id}/initial_config/`,
    {
      entry_list:
        data[InitialConfigurationStep.CADENCE_ENTRY_STEP]?.connectedTriggers ||
        [],
      win_exit_list:
        data[InitialConfigurationStep.CADENCE_WIN_STEP]?.connectedTriggers ||
        [],
      lose_exit_list:
        data[InitialConfigurationStep.CADENCE_LOSE_STEP]?.connectedTriggers ||
        [],
    },
  );
};

// CADENCE STEPS

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

export const convertCadenceStepIntoExit = (
  id: number,
  status: DestinationStatus,
) => {
  return postAuth<UpdatedTriggersList>(
    `${API_V1_URI}/sequential_marketing/cadence_step/${id}/convert_into_exit/`,
    { status },
  );
};

export const updateCadenceStepName = (id: number, name: string) => {
  return putAuth<CadenceStep>(
    `${API_V1_URI}/sequential_marketing/cadence_step/${id}/`,
    { name },
  );
};

export const deleteCadenceStep = (id: number) => {
  return deleteAuth<CadenceStep>(
    `${API_V1_URI}/sequential_marketing/cadence_step/${id}/`,
  );
};

export const modifyStepMarketingActionsConfiguration = async (
  stepId: number,
  list: StepMarketingActions[],
) => {
  return postAuth<{ result: StepMarketingActions[]; disabled: number[] }>(
    `${API_V1_URI}/sequential_marketing/cadence_step/${stepId}/modify_marketing_actions_configuration/`,
    list,
  );
};

export const fetchCadenceStepMemberIds = (cadenceId: number) => {
  return getAuth<{ [id: number]: number[] }>(
    `${API_V1_URI}/sequential_marketing/cadence/${cadenceId}/get_member_ids_in_steps/`,
  );
};

// CONNNECTED TRIGGERS

export const subscribeStepToStep = (
  cadenceId: number,
  data: {
    connected_trigger: ConnectedTrigger;
    step?: Pick<CadenceStep, 'id' | 'name' | 'canvas'>;
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

export const convertCadenceExitIntoStep = (
  cadenceId: number,
  triggerUuid: string,
  { name, canvas }: { name: string; canvas: GraphCanvas },
) => {
  return postAuth<UpdatedTrigger>(
    `${API_V1_URI}/sequential_marketing/cadence/${cadenceId}/connected_trigger/${triggerUuid}/convert_into_step/`,
    { name, canvas },
  );
};

// MARKETING ACTIONS

export const fetchMarketingActions = (params: StepMarketingActionsParams) => {
  return getAuth<PaginatedResponse<StepMarketingActions>>(
    `${API_V1_URI}/sequential_marketing/cadence_marketing_action/${buildUrlParams(
      params,
    )}`,
  );
};

export const createStepMarketingAction = (
  data: Partial<StepMarketingActions>,
) => {
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
  data: Partial<StepMarketingActions>,
) => {
  return patchAuth<StepMarketingActions>(
    `${API_V1_URI}/sequential_marketing/cadence_marketing_action/${id}/`,
    data,
  );
};

// METRICS

export const fetchGlobalMetrics = (
  cadenceId: number,
  params?: CadenceGlobalMetricsParams,
) => {
  return getAuth<CadenceGlobalMetrics>(
    `${API_V1_URI}/sequential_marketing/cadence_metrics/${cadenceId}/get_global_metrics/${buildUrlParams(
      params,
    )}`,
  );
};

export const fetchPresentMembersData = (
  cadenceId: number,
  params?: CadencePaginatedMetricsParams,
) => {
  return getAuth<MetricsPaginatedResponse<CadenceMembersInData>>(
    `${API_V1_URI}/sequential_marketing/cadence_metrics/${cadenceId}/get_present_members_data/${buildUrlParams(
      params,
    )}`,
  );
};

export const fetchMembersHistoric = (
  cadenceId: number,
  params?: CadencePaginatedMetricsParams,
) => {
  return getAuth<MetricsPaginatedResponse<CadenceMembersOutData>>(
    `${API_V1_URI}/sequential_marketing/cadence_metrics/${cadenceId}/get_members_historic/${buildUrlParams(
      params,
    )}`,
  );
};

export const searchCadencePresentMembersData = (
  cadenceId: number,
  params?: CadencePaginatedMetricsParams & { text: string },
) => {
  return getAuth<MetricsPaginatedResponse<CadenceMembersInData>>(
    `${API_V1_URI}/sequential_marketing/cadence_metrics/${cadenceId}/search_present_members/${buildUrlParams(
      params,
    )}`,
  );
};

export const searchCadenceMembersHistoric = (
  cadenceId: number,
  params?: CadencePaginatedMetricsParams & { text: string },
) => {
  return getAuth<MetricsPaginatedResponse<CadenceMembersOutData>>(
    `${API_V1_URI}/sequential_marketing/cadence_metrics/${cadenceId}/search_members_historic/${buildUrlParams(
      params,
    )}`,
  );
};

// CADENCE TEMPLATES

export const createCadenceFromTemplate = (config: CadenceConfigData) => {
  return postAuth<Cadence>(
    `${API_V1_URI}/sequential_marketing/create_cadence_from_template/`,
    config,
  );
};
