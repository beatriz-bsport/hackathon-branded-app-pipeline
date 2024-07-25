import { createSelector } from 'reselect';
import type { RootState } from '#src/reducers';

const _getReportV2State = (state: RootState) => state.reportsV2;

const _getReportsByIdV2 = (state: RootState) =>
  _getReportV2State(state).reports.byId;

const _getReportsIdsV2 = (state: RootState) =>
  _getReportV2State(state).reports.allIds;

export const getReportsV2 = createSelector(
  [_getReportsByIdV2, _getReportsIdsV2],
  (byId, allIds) =>
    allIds.map((id: number) => byId[id]).filter((report) => !!report),
);

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
