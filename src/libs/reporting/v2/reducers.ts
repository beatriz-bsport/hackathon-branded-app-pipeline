import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';

import { handleActions } from 'redux-actions';

import {
  fetchReportMetadataActionsV2,
  fetchReportsActionsV2,
} from '#src/libs/reporting/v2/actions';

import type {
  ReportConfiguration,
  ReportMetadataValue,
  ReportingStateV2,
} from '#src/libs/reporting/common/types';

const initialState: Immutable.Immutable<ReportingStateV2> =
  Immutable<ReportingStateV2>({
    reports: {
      loading: false,
      error: null,
      byId: {},
      allIds: [],
    },
    columnsMetadata: {
      loading: false,
      error: null,
      results: [],
    },
  });

export default handleActions<Immutable.Immutable<ReportingStateV2>, any>(
  {
    [fetchReportsActionsV2.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['reports', 'loading'], payload);
    },
    [fetchReportsActionsV2.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['reports', 'error'], payload);
    },
    [fetchReportsActionsV2.success.toString()]: (
      state,
      { payload }: { payload: ReportConfiguration[] },
    ) => {
      return state
        .merge(
          {
            reports: {
              byId: payload.reduce(
                (
                  acc: Record<number, ReportConfiguration>,
                  report: ReportConfiguration,
                ) => {
                  acc[report.id] = report;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        )
        .updateIn(
          ['reports', 'allIds'],
          (existingIds, newIds: number[]) => uniq([...existingIds, ...newIds]),
          payload.map((report) => report.id),
        );
    },
    [fetchReportMetadataActionsV2.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['columnsMetadata', 'loading'], payload);
    },
    [fetchReportMetadataActionsV2.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['columnsMetadata', 'error'], payload);
    },
    [fetchReportMetadataActionsV2.success.toString()]: (
      state,
      { payload }: { payload: ReportMetadataValue[] },
    ) => {
      return state.setIn(['columnsMetadata', 'results'], payload);
    },
  },
  initialState,
);
