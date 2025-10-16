import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "book/v1/offer";

export const fetchSessionsAPI = (params: {
  page: number;
  page_size: number;
}): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(params)}`];
};
