import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "buyable/v1/order";

export type FetchOrdersParams = {
  page: number;
  page_size: number;
  company?: number;
  state?: number;
  member?: number;
};

export const fetchOrdersAPI = (params: FetchOrdersParams): ApiConfig => {
  return [`${API_URL}${buildUrlParams(params)}`];
};
