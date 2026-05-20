import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  type SearchResponse,
  buildUrlParams,
} from "@bsport/store-base";

import type {
  CheckDeleteEstablishmentData,
  CreateEstablishmentPayload,
  Establishment,
  FetchEstablishmentParams,
  SearchEstablishmentParams,
  UpdateEstablishmentPayload,
} from "#src/establishments/types";

import {
  API_V1_URL,
  BOOKING_QUERY_KEY,
  DEFAULT_STALE_TIME,
} from "../constants";

// ----------------------------------------------------------------------------

const ESTABLISHMENT_API_URL = `${API_V1_URL}establishment`;

export const establishmentKeys = {
  all: [BOOKING_QUERY_KEY, "establishments"] as const,

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

  checkDeletion: (id: number) =>
    [...establishmentKeys.all, "check-deletion", id] as const,
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
  const queryFn = fetchEstablishments.bind(null, fetch, params);
  return queryOptions({
    queryKey: establishmentKeys.list(params),
    queryFn,
    staleTime: DEFAULT_STALE_TIME,
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
    staleTime: DEFAULT_STALE_TIME,
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

export const retrieveEstablishment = async (
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
  const queryFn = retrieveEstablishment.bind(null, fetch, establishmentId);
  return queryOptions({
    queryKey: establishmentKeys.detail(establishmentId),
    queryFn,
    staleTime: DEFAULT_STALE_TIME,
  });
};

// ----------------------------------------------------------------------------

export const createEstablishment = async (
  fetch: Fetch<Establishment>,
  payload: CreateEstablishmentPayload,
): Promise<Establishment> => {
  const { data } = await fetch(`${ESTABLISHMENT_API_URL}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
};

export const createEstablishmentMutationOptions = (
  fetch: Fetch<Establishment>,
) =>
  mutationOptions({
    mutationFn: (payload: CreateEstablishmentPayload) =>
      createEstablishment(fetch, payload),
  });

// ----------------------------------------------------------------------------

export const updateEstablishment = async (
  fetch: Fetch<Establishment>,
  id: number,
  payload: UpdateEstablishmentPayload,
): Promise<Establishment> => {
  const { data } = await fetch(`${ESTABLISHMENT_API_URL}/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data;
};

export const updateEstablishmentMutationOptions = (
  fetch: Fetch<Establishment>,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateEstablishmentPayload;
    }) => updateEstablishment(fetch, id, payload),
  });

// ----------------------------------------------------------------------------

export const checkDeleteEstablishment = async (
  fetch: Fetch<CheckDeleteEstablishmentData>,
  id: number,
): Promise<CheckDeleteEstablishmentData> => {
  const { data } = await fetch(
    `${ESTABLISHMENT_API_URL}/${id}/check_before_deletion/`,
  );
  return data;
};

export const checkDeleteEstablishmentQueryOptions = (
  fetch: Fetch<CheckDeleteEstablishmentData>,
  id: number,
) => {
  const queryFn = checkDeleteEstablishment.bind(null, fetch, id);
  return queryOptions({
    queryKey: establishmentKeys.checkDeletion(id),
    queryFn,
  });
};

// ----------------------------------------------------------------------------

export const deleteEstablishment = async (
  fetch: Fetch<void>,
  id: number,
): Promise<void> => {
  await fetch(
    `${ESTABLISHMENT_API_URL}/${id}/perform_destroy_with_side_effects/`,
    { method: "DELETE" },
  );
};

export const deleteEstablishmentMutationOptions = (fetch: Fetch<void>) =>
  mutationOptions({
    mutationFn: (id: number) => deleteEstablishment(fetch, id),
  });

// ----------------------------------------------------------------------------

export const restoreEstablishment = async (
  fetch: Fetch<Establishment>,
  id: number,
): Promise<Establishment> => {
  const { data } = await fetch(`${ESTABLISHMENT_API_URL}/${id}/restore/`, {
    method: "PUT",
  });
  return data;
};

export const restoreEstablishmentMutationOptions = (
  fetch: Fetch<Establishment>,
) =>
  mutationOptions({
    mutationFn: (id: number) => restoreEstablishment(fetch, id),
  });
