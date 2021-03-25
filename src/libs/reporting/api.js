import { API_URI, getAuth, buildUrlParams } from '../../http';

const fetchReportGeneration = async (reportId: number, params: any) => {
  return getAuth(
    `${API_URI}/reporting/reports/${reportId}/generate/${buildUrlParams(
      params,
    )}`,
  );
};

const fetchReportHeaders = async (reportId: number, params: any) => {
  return getAuth(
    `${API_URI}/reporting/reports/${reportId}/generate_headers/${buildUrlParams(
      params,
    )}`,
  );
};
export default {
  fetchReportGeneration,
  fetchReportHeaders,
};
