import { AxiosResponse } from 'axios';
import {
  API_URI,
  getAuth,
  buildUrlParams,
  deleteAuth,
  putAuth,
  postAuth,
  patchAuth,
} from '../../http';
import {
  ReportConfiguration,
  ReportFilterConfig,
  ReportFilterConfigParams,
  ReportMetadataValue,
} from './types';

export const fetchReportGeneration = async (reportId: number, params: any) => {
  return getAuth(
    `${API_URI}/reporting/reports/${reportId}/generate/${buildUrlParams(
      params,
    )}`,
  );
};

export const fetchReportHeaders = async (reportId: number, params: any) => {
  return getAuth(
    `${API_URI}/reporting/reports/${reportId}/generate_headers/${buildUrlParams(
      params,
    )}`,
  );
};
export const fetchExcelReporting = async (reportId: number, params: any) => {
  return getAuth(
    `${API_URI}/reporting/reports/${reportId}/export_async/${buildUrlParams(
      params,
    )}`,
  );
};

// TODO Fix the endpoint as it seems to not work properly
export const fetchReportOfferManagement = async (params: {
  coach_in?: number[];
  establishment_in?: number[];
  level_in?: number[];
  activity_in?: number[];
  date: string;
}) =>
  getAuth(
    `${API_URI}/reporting/reports/offer_management/${buildUrlParams(params)}`,
  );

export const fetchReports = async (): Promise<
  AxiosResponse<ReportConfiguration>
> => {
  return getAuth(`${API_URI}/reporting/reports/`);
};

export const fetchReportMetadata = async (): Promise<
  AxiosResponse<ReportMetadataValue>
> => {
  return getAuth(`${API_URI}/reporting/`);
};

export const deleteReport = async (reportId: number) => {
  return deleteAuth(`${API_URI}/reporting/reports/${reportId}/`);
};

export const updateReport = async (
  reportId: number,
  data: ReportConfiguration,
) => {
  return putAuth(`${API_URI}/reporting/reports/${reportId}/`, data);
};

export const createReport = async (data: ReportConfiguration) => {
  return postAuth(`${API_URI}/reporting/reports/`, data);
};

export const createReportFilterConfig = async (
  data: Omit<ReportFilterConfig, 'id'>,
): Promise<AxiosResponse<ReportFilterConfig>> =>
  postAuth(`${API_URI}/reporting/report-filter-config/`, data);

export const editReportFilterConfig = async (
  reportFilterConfigId: number,
  data: ReportFilterConfig,
): Promise<AxiosResponse<ReportFilterConfig>> =>
  patchAuth(
    `${API_URI}/reporting/report-filter-config/${reportFilterConfigId}/`,
    data,
  );

export const fetchReportFilterConfigList = async (
  params: ReportFilterConfigParams,
): Promise<AxiosResponse<ReportFilterConfig>> =>
  getAuth(
    `${API_URI}/reporting/report-filter-config/${buildUrlParams(params)}`,
  );

export const deleteReportFilterConfig = async (
  reporFilterId: number,
): Promise<AxiosResponse<void>> =>
  deleteAuth(`${API_URI}/reporting/report-filter-config/${reporFilterId}/`);
