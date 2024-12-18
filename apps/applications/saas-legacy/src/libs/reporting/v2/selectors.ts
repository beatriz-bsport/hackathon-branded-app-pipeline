import { createSelector } from 'reselect';
import type { RootState } from '#src/reducers';

const _getReportV2State = (state: RootState) => state.reportsV2;

export const getReportV2Loading = (state: RootState) =>
  _getReportV2State(state).reports.loading;

export const getReportCategoriesMetadata = (state: RootState) =>
  _getReportV2State(state).columnsMetadata;

const _getReportFilterConfigState = (state: RootState) =>
  _getReportV2State(state).reportFilterConfigs;

const _getReportFilterConfigById = (state: RootState) =>
  _getReportFilterConfigState(state).byId;

const _getReportFilterConfigIds = (state: RootState) =>
  _getReportFilterConfigState(state).allIds;

export const getReportFilterConfigLoading = (state: RootState) =>
  _getReportFilterConfigState(state).loading;

export const getReportFilterConfigs = createSelector(
  [
    _getReportFilterConfigById,
    _getReportFilterConfigIds,
    (state: RootState, reportId) => reportId,
  ],
  (byId, allIds, reportId) =>
    allIds
      .map((id: number) => byId[id])
      .filter(
        (reportFilterConfig) =>
          !!reportFilterConfig && reportFilterConfig.report === reportId,
      ),
);

export const getReportHeader = (state: RootState) =>
  _getReportV2State(state).reportHeaders;

export const getReportGenerateredRows = (state: RootState) =>
  _getReportV2State(state).reportGeneration;

export const getReportExcelState = (state: RootState) =>
  _getReportV2State(state).excelExport;

export const getInvalidFiltersV2 = (state: RootState) =>
  _getReportV2State(state).invalidFilters;

export const getReportsViewsPaginated = (state: RootState) =>
  _getReportV2State(state).reportsPaginated;

const _getReportsViewsPaginatedById = (state: RootState) =>
  _getReportV2State(state).reportsPaginated.byId;

const _getReportsViewsPaginatedAllIds = (state: RootState) =>
  _getReportV2State(state).reportsPaginated.allIds;

export const getReportsV2 = createSelector(
  [_getReportsViewsPaginatedById, _getReportsViewsPaginatedAllIds],
  (byId, allIds) =>
    allIds.map((id: number) => byId[id]).filter((report) => !!report),
);

const _getDefaultReportsViewsById = (state: RootState) =>
  _getReportV2State(state).reports.byId;

const _getDefaultReportsViewsAllIds = (state: RootState) =>
  _getReportV2State(state).reports.allIds;

export const getDefaultReportsV2 = createSelector(
  [_getDefaultReportsViewsById, _getDefaultReportsViewsAllIds],
  (byId, allIds) =>
    allIds.map((id: number) => byId[id]).filter((report) => !!report),
);
