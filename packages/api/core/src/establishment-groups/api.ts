import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  type SearchResponse,
  buildUrlParams,
} from "@bsport/store-base";

import type {
  EstablishmentGroup,
  FetchEstablishmentGroupParams,
  SearchEstablishmentGroupParams,
} from "#src/establishment-groups/types";

const ESTABLISHMENT_GROUP_API_URL = "core-data/v1/establishment-group";

const fetchEstablishmentGroupsAPI = (
  params: FetchEstablishmentGroupParams = {},
): ApiConfig => {
  return [`${ESTABLISHMENT_GROUP_API_URL}/${buildUrlParams(params)}`];
};

export const fetchEstablishmentGroups = async (
  fetch: Fetch<PaginatedResponse<EstablishmentGroup>>,
  params: FetchEstablishmentGroupParams = {},
): Promise<PaginatedResponse<EstablishmentGroup>> => {
  const [uri, init] = fetchEstablishmentGroupsAPI(params);
  const { data } = await fetch(uri, init);

  return data;
};

const searchEstablishmentGroupsAPI = (
  params: SearchEstablishmentGroupParams,
): ApiConfig => {
  return [`${ESTABLISHMENT_GROUP_API_URL}/search/${buildUrlParams(params)}`];
};

export const searchEstablishmentGroups = async (
  fetch: Fetch<SearchResponse<EstablishmentGroup>>,
  params: SearchEstablishmentGroupParams,
): Promise<SearchResponse<EstablishmentGroup>> => {
  const [uri, init] = searchEstablishmentGroupsAPI(params);
  const { data } = await fetch(uri, init);

  return data;
};
