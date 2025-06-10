import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';

import { handleActions } from 'redux-actions';

import {
  createReportFilterConfigActionsV2,
  editReportFilterConfigActionsV2,
  fetchReportFilterConfigListActionsV2,
  fetchReportMetadataActionsV2,
  fetchReportsActionsV2,
  reportGenerationDetailV2,
  reportHeadersDetailV2,
  deleteReportActionsV2,
  exportingExcelReportActionsV2,
  resetReportGenerationAction,
  reportGetInvalidFiltersV2,
  fetchPaginatedReportsV2ViewsActions,
} from '#src/libs/reporting/v2/actions';

import type {
  ReportConfiguration,
  ReportFilterConfig,
  ReportHeader,
  ReportingStateV2,
  SerializedReport,
  ReportMetadataValue,
  InvalidFiltersAPI,
} from '#src/libs/reporting/common/types';
import { PaginatedResponse } from '#src/state/types';
import { REPORT_VIEWS_FETCHING_PAGINATION_SIZE } from '#src/libs/reporting/common/constants';

const initialState: Immutable.Immutable<ReportingStateV2> =
  Immutable<ReportingStateV2>({
    reportsPaginated: {
      page: 1,
      next_page: null,
      previous_page: null,
      count: 0,
      page_size: REPORT_VIEWS_FETCHING_PAGINATION_SIZE,
      allIds: [],
      byId: {},
      loading: false,
      error: null,
    },
    reports: {
      loading: false,
      error: null,
      byId: {},
      allIds: [],
    },
    reportHeaders: {
      loading: false,
      error: null,
      results: {},
    },
    reportGeneration: {
      loading: false,
      error: null,
      result: [],
      total: 0,
      next_cursor: null,
      previous_cursor: null,
    },
    columnsMetadata: {
      loading: false,
      error: null,
      results: [],
    },
    reportFilterConfigs: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
      edit: { loading: false, error: null },
    },
    excelExport: {
      loading: false,
      error: null,
    },
    invalidFilters: { error: null, loading: false, results: {} },
  });

type PayloadReduceType<T> = { [id: number]: T };
export default handleActions<Immutable.Immutable<ReportingStateV2>, any>(
  {
    [fetchPaginatedReportsV2ViewsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['reportsPaginated', 'loading'], payload);
    },
    [fetchPaginatedReportsV2ViewsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['reportsPaginated', 'error'], payload);
    },
    [fetchPaginatedReportsV2ViewsActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<ReportConfiguration> },
    ) => {
      const { next_page, results, count, page } = payload;

      return state
        .setIn(['reportsPaginated', 'page'], page)
        .setIn(['reportsPaginated', 'next_page'], next_page)
        .setIn(['reportsPaginated', 'count'], count)
        .setIn(
          ['reportsPaginated', 'allIds'],
          uniq((results ?? []).map((report) => report.id)),
        )
        .merge(
          {
            reportsPaginated: {
              byId: (results ?? []).reduce<
                PayloadReduceType<ReportConfiguration>
              >(
                (accumulator, report) => ({
                  ...accumulator,
                  [report.id]: report,
                }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },
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
    [fetchReportFilterConfigListActionsV2.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => state.setIn(['reportFilterConfigs', 'loading'], payload),
    [fetchReportFilterConfigListActionsV2.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => state.setIn(['reportFilterConfigs', 'error'], payload),
    [fetchReportFilterConfigListActionsV2.success.toString()]: (
      state,
      { payload }: { payload: ReportFilterConfig[] },
    ) =>
      state
        .setIn(
          ['reportFilterConfigs', 'allIds'],
          payload.map((reportFilterConfig) => reportFilterConfig.id),
        )
        .merge(
          {
            reportFilterConfigs: {
              byId: payload.reduce(
                (acc: Record<number, ReportFilterConfig>, rf) => {
                  acc[rf.id] = rf;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        ),
    [createReportFilterConfigActionsV2.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => state.setIn(['reportFilterConfigs', 'loading'], payload),
    [createReportFilterConfigActionsV2.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => state.setIn(['reportFilterConfigs', 'error'], payload),
    [createReportFilterConfigActionsV2.success.toString()]: (
      state,
      { payload }: { payload: ReportFilterConfig },
    ) =>
      state
        .setIn(
          ['reportFilterConfigs', 'allIds'],
          uniq([...(state.reportFilterConfigs.allIds ?? []), payload.id]),
        )
        .merge(
          {
            reportFilterConfigs: {
              byId: {
                [payload.id]: {
                  ...payload,
                },
              },
            },
          },
          { deep: true },
        ),
    [editReportFilterConfigActionsV2.isLoading.toString()]: (
      state,
      { payload },
    ) => state.setIn(['reportFilterConfigs', 'edit', 'loading'], payload),
    [editReportFilterConfigActionsV2.error.toString()]: (state, { payload }) =>
      state.setIn(['reportFilterConfigs', 'edit', 'error'], payload),
    [editReportFilterConfigActionsV2.success.toString()]: (
      state,
      { payload },
    ) =>
      state.updateIn(
        ['reportFilterConfigs', 'byId', payload.id],
        (configState) => ({
          ...configState,
          ...payload,
        }),
      ),

    [deleteReportActionsV2.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['reports', 'loading'], payload);
    },
    [deleteReportActionsV2.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['reports', 'error'], payload);
    },
    [reportHeadersDetailV2.success.toString()]: (
      state,
      { payload }: { payload: ReportHeader },
    ) => {
      return state.setIn(['reportHeaders', 'results'], payload);
    },
    [reportHeadersDetailV2.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['reportHeaders', 'loading'], payload);
    },
    [reportHeadersDetailV2.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['reportHeaders', 'error'], payload);
    },
    [reportGenerationDetailV2.success.toString()]: (
      state,
      { payload }: { payload: SerializedReport },
    ) => {
      return state.setIn(['reportGeneration'], payload);
    },
    [reportGenerationDetailV2.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['reportGeneration', 'loading'], payload);
    },
    [reportGenerationDetailV2.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['reportGeneration', 'error'], payload);
    },
    [exportingExcelReportActionsV2.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['excelExport', 'loading'], payload);
    },
    [exportingExcelReportActionsV2.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['excelExport', 'error'], payload);
    },
    [resetReportGenerationAction.success.toString()]: (state) => {
      return state
        .set('reportHeaders', {
          loading: false,
          error: null,
          results: {},
        })
        .set('reportGeneration', {
          loading: false,
          error: null,
          result: [],
          total: 0,
          next_cursor: null,
          previous_cursor: null,
        });
    },
    [reportGetInvalidFiltersV2.success.toString()]: (
      state,
      { payload }: { payload: InvalidFiltersAPI },
    ) => {
      return state.setIn(['invalidFilters', 'results'], payload);
    },
    [reportGetInvalidFiltersV2.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['invalidFilters', 'loading'], payload);
    },
    [reportGetInvalidFiltersV2.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['invalidFilters', 'error'], payload);
    },
  },
  initialState,
);
