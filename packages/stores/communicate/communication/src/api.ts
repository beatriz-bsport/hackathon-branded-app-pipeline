import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "communicate/v1";

export const fetchCommunicationAPI = (params: {
  page: number;
  page_size: number;
}): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(params)}`];
};
