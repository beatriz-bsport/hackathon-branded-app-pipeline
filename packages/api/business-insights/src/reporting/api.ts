import { type ApiConfig, type Fetch, buildUrlParams } from "@bsport/store-base";

import type { FetchReportParticipantsListParams } from "./types";

const REPORTING_API_URI = "business-insights/v0/reporting/reports/";

export const fetchReportParticipantsListAPIConfig = (
  params: FetchReportParticipantsListParams,
): ApiConfig => {
  return [`${REPORTING_API_URI}offer_management/${buildUrlParams(params)}`];
};

export const fetchReportParticipantsListAPI = async (
  fetch: Fetch<string>,
  params: FetchReportParticipantsListParams,
): Promise<string> => {
  const [uri, init] = fetchReportParticipantsListAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data;
};
