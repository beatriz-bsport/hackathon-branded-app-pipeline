import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  fetchGlobalMetricsActions,
  fetchMembersHistoricActions,
  fetchPresentMembersDataActions,
  searchMembersHistoricActions,
  searchPresentMembersDataActions,
} from '#libs/sequential_marketing/actions';

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
      byCadenceId: {},
      loading: false,
      error: null,
    },
    membersHistoric: {
      byCadenceId: {},
      loading: false,
      error: null,
    },
    membersPresent: {
      byCadenceId: {},
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
      {
        payload,
      }: {
        payload: {
          cadenceId: number;
          data: CadenceGlobalMetrics;
        };
      },
    ) => {
      return state.setIn(
        ['globalMetrics', 'byCadenceId', payload.cadenceId.toString()],
        payload.data,
      );
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
      {
        payload,
      }: {
        payload: {
          cadenceId: number;
          data: MetricsPaginatedResponse<CadenceMembersInData>;
        };
      },
    ) => {
      return state.setIn(
        [
          'membersPresent',
          'byCadenceId',
          payload.cadenceId.toString(),
          'allData',
        ],
        payload.data,
      );
    },
    [searchPresentMembersDataActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['membersPresent', 'loading'], payload);
    },
    [searchPresentMembersDataActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['membersPresent', 'error'], payload);
    },
    [searchPresentMembersDataActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: {
          cadenceId: number;
          data: MetricsPaginatedResponse<CadenceMembersInData>;
        };
      },
    ) => {
      return state.setIn(
        [
          'membersPresent',
          'byCadenceId',
          payload.cadenceId.toString(),
          'searchResult',
        ],
        payload.data,
      );
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
      {
        payload,
      }: {
        payload: {
          cadenceId: number;
          data: MetricsPaginatedResponse<CadenceMembersOutData>;
        };
      },
    ) => {
      return state.setIn(
        [
          'membersHistoric',
          'byCadenceId',
          payload.cadenceId.toString(),
          'allData',
        ],
        payload.data,
      );
    },
    [searchMembersHistoricActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['membersHistoric', 'loading'], payload);
    },
    [searchMembersHistoricActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['membersHistoric', 'error'], payload);
    },
    [searchMembersHistoricActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: {
          cadenceId: number;
          data: MetricsPaginatedResponse<CadenceMembersOutData>;
        };
      },
    ) => {
      return state.setIn(
        [
          'membersHistoric',
          'byCadenceId',
          payload.cadenceId.toString(),
          'searchResult',
        ],
        payload.data,
      );
    },
  },
  initialCadenceStepState,
);
