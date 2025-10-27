import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type {
  FetchEstablishmentParams,
  SearchEstablishmentParams,
} from "#src/types";

const ESTABLISHMENT_API_URL = "core-data/v1/establishment";

export const fetchEstablishmentsAPI = (
  params: FetchEstablishmentParams = {},
): ApiConfig => {
  return [`${ESTABLISHMENT_API_URL}/${buildUrlParams(params)}`];
};

export const searchEstablishmentsAPI = (
  params: SearchEstablishmentParams,
): ApiConfig => {
  return [`${ESTABLISHMENT_API_URL}/search/${buildUrlParams(params)}`];
};
