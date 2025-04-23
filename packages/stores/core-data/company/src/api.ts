import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "core-data/v1/company";

export type FetchCompaniesParams = {
  search?: string;
  id__in?: number[];
};

export const fetchCompaniesAPI = (params: FetchCompaniesParams): ApiConfig => {
  return [`${API_URL}/search/${buildUrlParams(params)}`];
};

export const fetchFeaturesAPI = (): ApiConfig => {
  return [`${API_URL}/features/`];
};
