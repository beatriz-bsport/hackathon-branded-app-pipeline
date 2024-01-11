import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  fetchGlobalMetricsActions,
  fetchMembersHistoricActions,
  fetchPresentMembersDataActions,
} from '#libs/sequential_marketing/actions';
import { CADENCE_METRICS_LIST_PAGINATION } from '#libs/sequential_marketing/constants';

import type {
  CadenceGlobalMetrics,
  CadenceMembersInData,
  CadenceMembersOutData,
  MetricsPaginatedResponse,
  MetricsState,
} from '#libs/sequential_marketing/types';

type ImmutableCadenceMetricsState = Immutable.Immutable<MetricsState>;

export const initialCadenceStepState: ImmutableCadenceMetricsState =
  Immutable<MetricsState>({
    globalMetrics: {
      data: {
        count_members_that_entered: 0,
        success_rate: null,
        average_success_time: null,
        tags_count: 0,
        emails_count: 0,
        sms_count: 0,
        push_notif_count: 0,
      },
      loading: false,
      error: null,
    },
    membersHistoric: {
      data: {
        count: 0,
        next_page: 0,
        page_size: CADENCE_METRICS_LIST_PAGINATION,
        page: 1,
        results: [],
      },
      loading: false,
      error: null,
    },
    membersPresent: {
      data: {
        count: 0,
        next_page: 0,
        page_size: CADENCE_METRICS_LIST_PAGINATION,
        page: 1,
        results: [],
      },
      loading: false,
      error: null,
    },
  });

export default handleActions<ImmutableCadenceMetricsState, any>(
  {
    [fetchGlobalMetricsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['globalMetrics', 'loading'], payload);
    },
    [fetchGlobalMetricsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['globalMetrics', 'error'], payload);
    },
    [fetchGlobalMetricsActions.success.toString()]: (
      state,
      { payload }: { payload: CadenceGlobalMetrics },
    ) => {
      return state.setIn(['globalMetrics', 'data'], payload);
    },
    [fetchPresentMembersDataActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['membersPresent', 'loading'], payload);
    },
    [fetchPresentMembersDataActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['membersPresent', 'error'], payload);
    },
    [fetchPresentMembersDataActions.success.toString()]: (
      state,
      { payload }: { payload: MetricsPaginatedResponse<CadenceMembersInData> },
    ) => {
      return state.setIn(['membersPresent', 'data'], payload);
    },
    [fetchMembersHistoricActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['membersHistoric', 'loading'], payload);
    },
    [fetchMembersHistoricActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['membersHistoric', 'error'], payload);
    },
    [fetchMembersHistoricActions.success.toString()]: (
      state,
      { payload }: { payload: MetricsPaginatedResponse<CadenceMembersOutData> },
    ) => {
      return state.setIn(['membersHistoric', 'data'], payload);
    },
  },
  initialCadenceStepState,
);
