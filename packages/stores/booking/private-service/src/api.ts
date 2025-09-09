import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type {
  FetchPrivateServiceParams,
  SearchPrivateServiceParams,
} from "./types";

const API_URL = "book/v1/private-service/";

export const fetchPrivateServicesAPI = (
  params: FetchPrivateServiceParams,
): ApiConfig => {
  return [`${API_URL}/private-service/${buildUrlParams(params)}`];
};

export const searchPrivateServicesAPI = (
  params: SearchPrivateServiceParams,
): ApiConfig => {
  return [`${API_URL}/private-service/search/${buildUrlParams(params)}`];
};
