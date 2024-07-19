import type {
  ReportConfiguration,
  ReportMetadataValue,
} from '#src/libs/reporting/common/types';
import { API_URI, getAuth } from '#src/http';

export const fetchDefaultReports = () => {
  return getAuth<ReportConfiguration[]>(
    `${API_URI}/reporting/reports-v2/retrieve_default_reports_per_category/`,
  );
};

export const fetchReportMetadataV2 = () => {
  return getAuth<ReportMetadataValue[]>(`${API_URI}/reporting/`);
};
