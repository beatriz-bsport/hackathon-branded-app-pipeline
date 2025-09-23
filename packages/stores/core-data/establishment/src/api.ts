import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type {
  FetchEstablishmentParams,
  SearchEstablishmentParams,
} from "./types";

const API_URL = "core-data/v1/establishment";

export const fetchEstablishmentsAPI = (
  params: FetchEstablishmentParams = {},
): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(params)}`];
};

export const searchEstablishmentsAPI = (
  params: SearchEstablishmentParams,
): ApiConfig => {
  return [`${API_URL}/search/${buildUrlParams(params)}`];
};
