import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  type SearchResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL } from "#src/constants";

import type {
  EstablishmentGroup,
  FetchEstablishmentGroupQueryParams,
  SearchEstablishmentGroupSearchParams,
} from "./types";

const ESTABLISHMENT_GROUP_API_URL = `${API_V1_URL}establishment-group`;

export const establishmentGroupKeys = {
  all: ["@api-book", "establishmentGroups"] as const,
  list: (params: FetchEstablishmentGroupQueryParams) =>
    [...establishmentGroupKeys.all, "list", params] as const,
  search: (params: SearchEstablishmentGroupSearchParams) =>
    [...establishmentGroupKeys.all, "search", params] as const,
};

const fetchEstablishmentGroupsAPI = (
  params: FetchEstablishmentGroupQueryParams = {},
): ApiConfig => {
  return [`${ESTABLISHMENT_GROUP_API_URL}/${buildUrlParams(params)}`];
};

export const fetchEstablishmentGroups = async (
  fetch: Fetch<PaginatedResponse<EstablishmentGroup>>,
  params: FetchEstablishmentGroupQueryParams = {},
): Promise<PaginatedResponse<EstablishmentGroup>> => {
  const [uri, init] = fetchEstablishmentGroupsAPI(params);
  const { data } = await fetch(uri, init);

  return data;
};

const searchEstablishmentGroupsAPI = (
  params: SearchEstablishmentGroupSearchParams,
): ApiConfig => {
  return [`${ESTABLISHMENT_GROUP_API_URL}/search/${buildUrlParams(params)}`];
};

export const searchEstablishmentGroups = async (
  fetch: Fetch<SearchResponse<EstablishmentGroup>>,
  params: SearchEstablishmentGroupSearchParams,
): Promise<SearchResponse<EstablishmentGroup>> => {
  const [uri, init] = searchEstablishmentGroupsAPI(params);
  const { data } = await fetch(uri, init);

  return data;
};
