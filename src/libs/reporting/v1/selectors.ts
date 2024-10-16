import { createSelector } from 'reselect';
import { RootState } from '#src/reducers';
import type { ReportConfiguration } from '#src/libs/reporting/common/types';

export const getReportRows = (state: RootState, reportId: number) => {
  const rows = Object.keys(state.reports.reportResponse).includes(
    reportId.toString(),
  )
    ? // @ts-expect-error
      state.reports.reportResponse[reportId].result
    : null;
  return rows;
};

// @ts-expect-error
export const getReportRowsLoading = (state) => {
  return state.reports.loading;
};

export const getNextPage = (state: RootState, reportId: number) => {
  const nextPage = Object.keys(state.reports.reportResponse).includes(
    reportId.toString(),
  )
    ? // @ts-expect-error
      state.reports.reportResponse[reportId].next_page
    : null;
  return nextPage;
};

export const getPreviousPage = (state: RootState, reportId: number) => {
  const previousPage = Object.keys(state.reports.reportResponse).includes(
    reportId.toString(),
  )
    ? // @ts-expect-error
      state.reports.reportResponse[reportId].previous_page
    : null;
  return previousPage;
};

export const getOtherPages = (state: RootState, reportId: number) => {
  const otherPages = Object.keys(state.reports.reportResponse).includes(
    reportId.toString(),
  )
    ? // @ts-expect-error
      state.reports.reportResponse[reportId].other_pages
    : null;
  return otherPages;
};

// @ts-expect-error
export const getPageSize = (state) => {
  return state.reports.reportResponse.page_size;
};

export const getReportHeaders = (state: RootState, reportId: number) => {
  const headers = Object.keys(state.reports.reportHeaders).includes(
    reportId.toString(),
  )
    ? // @ts-expect-error
      state.reports.reportHeaders[reportId]
    : null;
  return headers;
};

export const getReportHeadersLoading = (state: RootState) => {
  return state.reports.headersLoading;
};

export const getReportMetadata = (state: RootState) => {
  return { ...state.reports.metadata };
};

export const getReports = (state: RootState) => {
  return state.reports.list;
};

export const getCustomViewsReports = (state: RootState) => {
  return state.reports.list.results;
};

export const getReport = (
  state: RootState,
  reportId: number,
): ReportConfiguration => {
  // @ts-expect-error
  return (
    state.reports?.list?.results?.find((report) => report.id === reportId) ?? {}
  );
};

const getReportFilterConfigData = (state: RootState) =>
  state.reports.reportFilterConfigs.byId;

const getReportFilterConfigIds = (state: RootState) =>
  state.reports.reportFilterConfigs.allIds;

export const getReportFilterConfigList = createSelector(
  [getReportFilterConfigIds, getReportFilterConfigData],
  (ids, reportFilterConfig) => ids.map((id) => reportFilterConfig[id]),
);

export const getTotalElementsCount = (state: RootState, reportId: number) => {
  const totalElementsCount = Object.keys(state.reports.reportResponse).includes(
    reportId.toString(),
  )
    ? // @ts-expect-error
      state.reports.reportResponse[reportId].total
    : null;
  return totalElementsCount;
};
