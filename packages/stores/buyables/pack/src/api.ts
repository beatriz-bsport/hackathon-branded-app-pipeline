import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "buyable/v1/payment_combo";

export const fetchPacksAPI = (params: {
  page: number;
  page_size: number;
}): ApiConfig => {
  return [`${API_URL}${buildUrlParams(params)}`];
};
