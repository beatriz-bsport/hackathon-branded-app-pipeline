import { createAction } from 'redux-actions';
import type { OptionCallback, Dispatch } from '../../../state/types';

import {
  fetchGlobalMetrics as fetchGlobalMetricsAPI,
  fetchPresentMembersData as fetchPresentMembersDataAPI,
  fetchMembersHistoric as fetchMembersHistoricAPI,
} from '#libs/sequential_marketing/api';

import type {
  CadenceGlobalMetrics,
  CadenceGlobalMetricsParams,
  CadenceMembersInData,
  CadenceMembersOutData,
  CadencePaginatedMetricsParams,
  MetricsPaginatedResponse,
} from '#libs/sequential_marketing/types';

export const fetchGlobalMetricsActions = {
  isLoading: createAction<boolean>('CADENCE_GLOBAL_METRICS/IS_LOADING'),
  error: createAction<Error | null>('CADENCE_GLOBAL_METRICS/ERROR'),
  success: createAction<{
    cadenceId: number;
    data: CadenceGlobalMetrics;
  }>('CADENCE_GLOBAL_METRICS/SUCCESS'),
};

export function fetchGlobalMetrics(
  cadenceId: number,
  date_filter?: CadenceGlobalMetricsParams,
  options?: OptionCallback<CadenceGlobalMetrics>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchGlobalMetricsActions.isLoading(true));
    dispatch(fetchGlobalMetricsActions.error(null));

    try {
      const response = await fetchGlobalMetricsAPI(cadenceId, date_filter);
      dispatch(
        fetchGlobalMetricsActions.success({ cadenceId, data: response.data }),
      );
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchGlobalMetricsActions.error(err));
      options?.onError?.();
    }

    dispatch(fetchGlobalMetricsActions.isLoading(false));
  };
}

export const fetchPresentMembersDataActions = {
  isLoading: createAction<boolean>('CADENCE_MEMBERS_PRESENT/IS_LOADING'),
  error: createAction<Error | null>('CADENCE_MEMBERS_PRESENT/ERROR'),
  success: createAction<{
    cadenceId: number;
    data: MetricsPaginatedResponse<CadenceMembersInData>;
  }>('CADENCE_MEMBERS_PRESENT/SUCCESS'),
};

export function fetchPresentMembersData(
  cadenceId: number,
  params?: CadencePaginatedMetricsParams,
  options?: OptionCallback<MetricsPaginatedResponse<CadenceMembersInData>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchPresentMembersDataActions.isLoading(true));
    dispatch(fetchPresentMembersDataActions.error(null));

    try {
      const response = await fetchPresentMembersDataAPI(cadenceId, params);
      dispatch(
        fetchPresentMembersDataActions.success({
          cadenceId,
          data: response.data,
        }),
      );
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchPresentMembersDataActions.error(err));
      options?.onError?.();
    }

    dispatch(fetchPresentMembersDataActions.isLoading(false));
  };
}

export const fetchMembersHistoricActions = {
  isLoading: createAction<boolean>('CADENCE_MEMBERS_HISTORIC/IS_LOADING'),
  error: createAction<Error | null>('CADENCE_MEMBERS_HISTORIC/ERROR'),
  success: createAction<{
    cadenceId: number;
    data: MetricsPaginatedResponse<CadenceMembersOutData>;
  }>('CADENCE_MEMBERS_HISTORIC/SUCCESS'),
};

export function fetchMembersHistoric(
  cadenceId: number,
  params?: CadencePaginatedMetricsParams,
  options?: OptionCallback<MetricsPaginatedResponse<CadenceMembersOutData>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMembersHistoricActions.isLoading(true));
    dispatch(fetchMembersHistoricActions.error(null));

    try {
      const response = await fetchMembersHistoricAPI(cadenceId, params);
      dispatch(
        fetchMembersHistoricActions.success({ cadenceId, data: response.data }),
      );
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchMembersHistoricActions.error(err));
      options?.onError?.();
    }

    dispatch(fetchMembersHistoricActions.isLoading(false));
  };
}
