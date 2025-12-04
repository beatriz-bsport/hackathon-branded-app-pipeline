import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "book/v1";
const API_URL_SESSION = `${API_URL}/offer`;

type FetchSessionsParams = {
  min_date: string;
  max_date: string;
};

export const fetchManagerSessionsAPI = (
  params: FetchSessionsParams,
): ApiConfig => {
  return [`${API_URL_SESSION}/as_manager/${buildUrlParams(params)}`];
};
