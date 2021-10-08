import { AxiosResponse } from 'axios';
import {
  API_URI,
  getAuth,
  buildUrlParams,
  deleteAuth,
  putAuth,
  postAuth,
} from '../../http';
import { ReportConfiguration, ReportMetadataValue } from './types';

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
