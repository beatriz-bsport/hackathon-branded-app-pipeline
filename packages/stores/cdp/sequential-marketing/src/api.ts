import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "customer-data-platform/v1/sequential-marketing";

export const fetchCadencesAPI = (params: {
  page: number;
  page_size: number;
  id__in?: number[];
}): ApiConfig => {
  return [`${API_URL}/cadences/${buildUrlParams(params)}`];
};
