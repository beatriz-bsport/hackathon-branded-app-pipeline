import type {
  ReportConfiguration,
  ReportHeader,
  ReportHeaderQueryParams,
  ReportSerializerParams,
  SerializedReport,
  ReportMetadataValue,
  ReportFilterConfigParams,
  ReportFilterConfig,
  ReportFilterConfigCreateData,
  ReportUpdateAPI,
  IsReportNameUsedParams,
  InvalidFiltersAPI,
} from '#src/libs/reporting/common/types';
import {
  API_URI,
  buildUrlParams,
  deleteAuth,
  getAuth,
  patchAuth,
  postAuth,
} from '#src/http';
import type { PaginatedResponse } from '#src/state/types';
import { cleanParams } from '#src/utils/createUrlHandlers';

export const fetchDefaultReports = () => {
  return getAuth<ReportConfiguration[]>(
    `${API_URI}/reporting/reports-v2/retrieve_default_reports_per_category/`,
  );
};

export const fetchReportMetadataV2 = () => {
  return getAuth<ReportMetadataValue[]>(`${API_URI}/reporting/`);
};

export const fetchReportsV2 = () => {
  return getAuth<ReportConfiguration[]>(`${API_URI}/reporting/reports-v2/`);
};

export const createReportV2 = (
  data: Partial<Omit<ReportConfiguration, 'id'>>,
) => {
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

export const deleteReportV2 = (reportId: number) => {
  return deleteAuth(`${API_URI}/reporting/reports-v2/${reportId}/`);
};

export const fetchReportHeadersV2 = (
  reportId: number,
  params: ReportHeaderQueryParams,
) => {
  const cleanedParams = cleanParams(params);

  return getAuth<ReportHeader>(
    `${API_URI}/reporting/reports-v2/${reportId}/generate_headers/${buildUrlParams(
      cleanedParams,
    )}`,
  );
};

export const fetchSerializedReportV2 = (
  reportId: number,
  params: ReportSerializerParams,
) => {
  const cleanedParams = cleanParams(params);
  return getAuth<SerializedReport>(
    `${API_URI}/reporting/reports-v2/${reportId}/serialized_report/${buildUrlParams(
      cleanedParams,
    )}`,
  );
};

export const fetchExcelReporting = (reportId: number, params: any) => {
  return getAuth<string>(
    `${API_URI}/reporting/reports-v2/${reportId}/export_async/${buildUrlParams(
      params,
    )}`,
  );
};

export const checkIsReportNameUsedAPI = (params: IsReportNameUsedParams) => {
  return getAuth<{ is_used: boolean }>(
    `${API_URI}/reporting/reports-v2/is_report_name_used/${buildUrlParams(
      params,
    )}`,
  );
};

export const getInvalidFilters = (reportId: number) =>
  getAuth<InvalidFiltersAPI>(
    `${API_URI}/reporting/reports-v2/${reportId}/get_invalid_filters/`,
  );
