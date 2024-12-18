import { API_URI, buildUrlParams, getAuth } from '#src/http';

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
