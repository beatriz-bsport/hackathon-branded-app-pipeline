import { RootState } from '../../reducers';
import { ReportConfiguration } from './types';

export const getReportRows = (state: RootState, reportId: number) => {
  const rows = Object.keys(state.reports.reportResponse).includes(
    reportId.toString(),
  )
    ? state.reports.reportResponse[reportId].result
    : null;
  return rows;
};

export const getReportRowsLoading = (state) => {
  return state.reports.loading;
};

export const getNextPage = (state: RootState, reportId: number) => {
  const nextPage = Object.keys(state.reports.reportResponse).includes(
    reportId.toString(),
  )
    ? state.reports.reportResponse[reportId].next_page
    : null;
  return nextPage;
};

export const getPreviousPage = (state: RootState, reportId: number) => {
  const previousPage = Object.keys(state.reports.reportResponse).includes(
    reportId.toString(),
  )
    ? state.reports.reportResponse[reportId].previous_page
    : null;
  return previousPage;
};

export const getOtherPages = (state: RootState, reportId: number) => {
  const otherPages = Object.keys(state.reports.reportResponse).includes(
    reportId.toString(),
  )
    ? state.reports.reportResponse[reportId].other_pages
    : null;
  return otherPages;
};

export const getPageSize = (state) => {
  return state.reports.reportResponse.page_size;
};

export const getReportHeaders = (state: RootState, reportId: number) => {
  const headers = Object.keys(state.reports.reportHeaders).includes(
    reportId.toString(),
  )
    ? state.reports.reportHeaders[reportId]
    : null;
  return headers;
};

export const getReportHeadersLoading = (state: RootState) => {
  return state.reports.headersLoading;
};

export const getReportMetadata = (state: RootState) => {
  return state.reports.metadata;
};

export const getReports = (state: RootState) => {
  return state.reports.list;
};

export const getReport = (
  state: RootState,
  reportId: number,
): ReportConfiguration => {
  return (
    state.reports?.list?.results?.find((report) => report.id === reportId) ?? {}
  );
};
