import type {
  ReportConfiguration,
  ReportHeader,
  ReportHeaderQueryParams,
  ReportMetadataValue,
  ReportFilterConfigParams,
  ReportFilterConfig,
  ReportFilterConfigCreateData,
  ReportUpdateAPI,
} from '#src/libs/reporting/common/types';
import {
  API_URI,
  buildUrlParams,
  getAuth,
  patchAuth,
  postAuth,
} from '#src/http';
import type { PaginatedResponse } from '#src/state/types';

export const fetchDefaultReports = () => {
  return getAuth<ReportConfiguration[]>(
    `${API_URI}/reporting/reports-v2/retrieve_default_reports_per_category/`,
  );
};

export const fetchReportMetadataV2 = () => {
  return getAuth<ReportMetadataValue[]>(`${API_URI}/reporting/`);
};

export const createReportV2 = (data: Omit<ReportConfiguration, 'id'>) => {
  return postAuth<ReportConfiguration>(
    `${API_URI}/reporting/reports-v2/`,
    data,
  );
};

export const updateReportV2 = (reportId: number, data: ReportUpdateAPI) => {
  return patchAuth<ReportConfiguration>(
    `${API_URI}/reporting/reports-v2/${reportId}/`,
    data,
  );
};

export const fetchReportFilterConfigList = (params: ReportFilterConfigParams) =>
  getAuth<PaginatedResponse<ReportFilterConfig>>(
    `${API_URI}/reporting/report-filter-config/${buildUrlParams(params)}`,
  );

export const createReportFilterConfig = (data: ReportFilterConfigCreateData) =>
  postAuth<ReportFilterConfig>(`${API_URI}/reporting/report-filter-config/`, {
    ...data,
  });

export const editReportFilterConfig = (
  reportFilterConfigId: number,
  data: Partial<ReportFilterConfig>,
) =>
  patchAuth<ReportFilterConfig>(
    `${API_URI}/reporting/report-filter-config/${reportFilterConfigId}/`,
    data,
  );

export const fetchReportHeadersV2 = (
  reportId: number,
  params: ReportHeaderQueryParams,
) => {
  return getAuth<ReportHeader>(
    `${API_URI}/reporting/reports-v2/${reportId}/generate_headers/${buildUrlParams(
      params,
    )}`,
  );
};
