import { createAction } from 'redux-actions';
import type { OptionCallback, Dispatch } from '../../../state/types';

import {
  fetchGlobalMetrics as fetchGlobalMetricsAPI,
  fetchPresentMembersData as fetchPresentMembersDataAPI,
  fetchMembersHistoric as fetchMembersHistoricAPI,
  searchPresentMembersData as searchPresentMembersDataAPI,
  searchMembersHistoric as searchMembersHistoricAPI,
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

export const searchPresentMembersDataActions = {
  isLoading: createAction<boolean>('SEARCH_CADENCE_MEMBERS_PRESENT/IS_LOADING'),
  error: createAction<Error | null>('SEARCH_CADENCE_MEMBERS_PRESENT/ERROR'),
  success: createAction<{
    cadenceId: number;
    data: MetricsPaginatedResponse<CadenceMembersInData>;
  }>('SEARCH_CADENCE_MEMBERS_PRESENT/SUCCESS'),
};

export function searchPresentMembersData(
  cadenceId: number,
  params?: CadencePaginatedMetricsParams & { text: string },
  options?: OptionCallback<MetricsPaginatedResponse<CadenceMembersInData>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(searchPresentMembersDataActions.isLoading(true));
    dispatch(searchPresentMembersDataActions.error(null));

    try {
      const response = await searchPresentMembersDataAPI(cadenceId, params);
      dispatch(
        searchPresentMembersDataActions.success({
          cadenceId,
          data: response.data,
        }),
      );
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(searchPresentMembersDataActions.error(err));
      options?.onError?.();
    }

    dispatch(searchPresentMembersDataActions.isLoading(false));
  };
}

export const searchMembersHistoricActions = {
  isLoading: createAction<boolean>(
    'SEARCH_CADENCE_MEMBERS_HISTORIC/IS_LOADING',
  ),
  error: createAction<Error | null>('SEARCH_CADENCE_MEMBERS_HISTORIC/ERROR'),
  success: createAction<{
    cadenceId: number;
    data: MetricsPaginatedResponse<CadenceMembersOutData>;
  }>('SEARCH_CADENCE_MEMBERS_HISTORIC/SUCCESS'),
};

export function searchMembersHistoric(
  cadenceId: number,
  params?: CadencePaginatedMetricsParams & { text: string },
  options?: OptionCallback<MetricsPaginatedResponse<CadenceMembersOutData>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(searchMembersHistoricActions.isLoading(true));
    dispatch(searchMembersHistoricActions.error(null));

    try {
      const response = await searchMembersHistoricAPI(cadenceId, params);
      dispatch(
        searchMembersHistoricActions.success({
          cadenceId,
          data: response.data,
        }),
      );
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(searchMembersHistoricActions.error(err));
      options?.onError?.();
    }

    dispatch(searchMembersHistoricActions.isLoading(false));
  };
}
