import { API_URI, getAuth, buildUrlParams } from '../../http';

const fetchReportGeneration = async (reportId: number, params: any) => {
  return getAuth(
    `${API_URI}/reporting/reports/${reportId}/generate/${buildUrlParams(
      params,
    )}`,
  );
};

export default {
  fetchReportGeneration,
};
