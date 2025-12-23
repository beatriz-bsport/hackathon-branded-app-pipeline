import type {
  FetchEstablishmentGroupQueryParams,
  SearchEstablishmentGroupSearchParams,
} from "@bsport/api-core";
import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const ESTABLISHMENT_GROUP_API_URL = "core-data/v1/establishment-group";

export const fetchEstablishmentGroupsAPI = (
  params: FetchEstablishmentGroupQueryParams = {},
): ApiConfig => {
  return [`${ESTABLISHMENT_GROUP_API_URL}/${buildUrlParams(params)}`];
};

export const searchEstablishmentGroupsAPI = (
  params: SearchEstablishmentGroupSearchParams,
): ApiConfig => {
  return [`${ESTABLISHMENT_GROUP_API_URL}/search/${buildUrlParams(params)}`];
};
