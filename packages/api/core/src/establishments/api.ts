import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

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

import { API_V1_URL, QUERY_KEY_MAIN } from "../constants";

// ----------------------------------------------------------------------------

const ESTABLISHMENT_API_URL = `${API_V1_URL}/establishment`;

// TODO: use the same stale time for all establishments queries
const ESTABLISHMENTS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const establishmentKeys = {
  all: [QUERY_KEY_MAIN, "establishments"] as const,

  lists: () => [...establishmentKeys.all, "lists"] as const,
  list: (params: FetchEstablishmentParams) =>
    [...establishmentKeys.lists(), params] as const,

  infiniteLists: () => [...establishmentKeys.lists(), "infinite"] as const,
  infiniteList: (params: FetchEstablishmentParams) =>
    [...establishmentKeys.infiniteLists(), params] as const,

  searches: () => [...establishmentKeys.lists(), "search"] as const,
  search: (params: SearchEstablishmentParams) =>
    [...establishmentKeys.searches(), params] as const,

  details: () => [...establishmentKeys.all, "detail"] as const,
  detail: (id: number) => [...establishmentKeys.details(), id] as const,
};

// ----------------------------------------------------------------------------

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

export const fetchEstablishmentsQueryOptions = (
  fetch: Fetch<PaginatedResponse<Establishment>>,
  params: FetchEstablishmentParams = {},
) => {
  return queryOptions({
    queryKey: establishmentKeys.list(params),
    queryFn: () => fetchEstablishments(fetch, params),
    staleTime: ESTABLISHMENTS_STALE_TIME,
  });
};

export const fetchEstablishmentsInfiniteQueryOptions = (
  fetch: Fetch<PaginatedResponse<Establishment>>,
  params: FetchEstablishmentParams = {},
) => {
  return infiniteQueryOptions({
    queryKey: establishmentKeys.infiniteList(params),
    queryFn: ({ pageParam }) => {
      return fetchEstablishments(fetch, { ...params, page: pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
    enabled: Boolean(params.company && params.company > 0),
    staleTime: ESTABLISHMENTS_STALE_TIME,
  });
};

// ----------------------------------------------------------------------------

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

// ----------------------------------------------------------------------------

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
    queryKey: establishmentKeys.detail(establishmentId),
    queryFn: () => retriveEstablishment(fetch, establishmentId),
    staleTime: ESTABLISHMENTS_STALE_TIME,
  });
};
