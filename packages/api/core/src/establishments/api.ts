import { queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  type SearchResponse,
  buildUrlParams,
} from "@bsport/store-base";

import type {
  Establishment,
  FetchEstablishmentParams,
  SearchEstablishmentParams,
} from "#src/establishments/types";

import { API_V1_URL } from "../constants";

const ESTABLISHMENT_API_URL = `${API_V1_URL}/establishment`;

// TODO: use the same stale time for all establishments queries
const ESTABLISHMENTS_STALE_TIME = 2 * 60 * 1000; // 5 minutes

// TODO: add the other keys (list, search, etc.)
export const establishmentKeys = {
  all: ["@api-core", "establishments"] as const,
  details: (id: number) => [...establishmentKeys.all, id] as const,
};

const fetchEstablishmentsAPI = (
  params: FetchEstablishmentParams = {},
): ApiConfig => {
  return [`${ESTABLISHMENT_API_URL}/${buildUrlParams(params)}`];
};

export const fetchEstablishments = async (
  fetch: Fetch<PaginatedResponse<Establishment>>,
  params: FetchEstablishmentParams = {},
): Promise<PaginatedResponse<Establishment>> => {
  const [uri, init] = fetchEstablishmentsAPI(params);
  const { data } = await fetch(uri, init);

  return data;
};

const searchEstablishmentsAPI = (
  params: SearchEstablishmentParams,
): ApiConfig => {
  return [`${ESTABLISHMENT_API_URL}/search/${buildUrlParams(params)}`];
};

export const searchEstablishments = async (
  fetch: Fetch<SearchResponse<Establishment>>,
  params: SearchEstablishmentParams,
): Promise<SearchResponse<Establishment>> => {
  const [uri, init] = searchEstablishmentsAPI(params);
  const { data } = await fetch(uri, init);

  return data;
};

export const retriveEstablishment = async (
  fetch: Fetch<Establishment>,
  establishmentId: number,
): Promise<Establishment> => {
  const { data } = await fetch(`${ESTABLISHMENT_API_URL}/${establishmentId}/`);
  return data;
};

export const retrieveEstablishmentQueryOptions = (
  fetch: Fetch<Establishment>,
  establishmentId: number,
) => {
  return queryOptions({
    queryKey: establishmentKeys.details(establishmentId),
    queryFn: () => retriveEstablishment(fetch, establishmentId),
    staleTime: ESTABLISHMENTS_STALE_TIME,
  });
};
