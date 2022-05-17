import memoize from 'memoize-one';
import { createSelector } from 'reselect';
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

export const getDynamicDataLoading = memoize((state: RootState) => ({
  activity: state.metaActivity.loading,
  payment_pack: state.paymentPack.loading,
  coach: state.coach.loading,
  establishment: state.establishment.loading,
  user: state.member.loading,
  email: state.member.loading,
  billing_group: state.establishment.establishmentBillingGroup.loading,
  billing_establishment: state.establishment.loading,
  private_service: state.privateService.privateService.loading,
  private_slot: state.privateService.privateSlot.loading,
  private_pass: state.privateService.privatePass.loading,
  giftcard: state.giftcard.giftcard.loading,
  coupon: state.coupon.coupon.loading,
  video: state.video.loading,
  contract: state.subscription.contract.loading,
  subshop: state.shop.loading,
  // TODO when we migrate the feature to franchise
  company: false,
}));

export const getDynamicDataHasBeenLoaded = (state: RootState) =>
  state.reports.reportFilterConfigs.dynamicDataHasBeenLoaded;

const getReportFilterConfigData = (state: RootState) =>
  state.reports.reportFilterConfigs.byId;

const getReportFilterConfigIds = (state: RootState) =>
  state.reports.reportFilterConfigs.allIds;

export const getReportFilterConfigList = createSelector(
  [getReportFilterConfigIds, getReportFilterConfigData],
  (ids, reportFilterConfig) => ids.map((id) => reportFilterConfig[id]),
);
