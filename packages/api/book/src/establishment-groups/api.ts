import { mutationOptions, queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  type SearchResponse,
  buildUrlParams,
} from "@bsport/store-base";

import {
  API_V1_URL,
  BOOKING_QUERY_KEY,
  DEFAULT_STALE_TIME,
} from "#src/constants";

import type {
  CheckDeleteEstablishmentGroupData,
  CreateEstablishmentGroupPayload,
  EstablishmentGroup,
  FetchEstablishmentGroupQueryParams,
  SearchEstablishmentGroupSearchParams,
  UpdateEstablishmentGroupPayload,
} from "./types";

const ESTABLISHMENT_GROUP_API_URL = `${API_V1_URL}/establishment-group`;

export const establishmentGroupKeys = {
  all: [BOOKING_QUERY_KEY, "establishmentGroups"] as const,

  lists: () => [...establishmentGroupKeys.all, "lists"] as const,
  list: (params: FetchEstablishmentGroupQueryParams = {}) =>
    [...establishmentGroupKeys.lists(), params] as const,

  searches: () => [...establishmentGroupKeys.lists(), "search"] as const,
  search: (params: SearchEstablishmentGroupSearchParams = {}) =>
    [...establishmentGroupKeys.searches(), params] as const,

  details: () => [...establishmentGroupKeys.all, "detail"] as const,
  detail: (id: number) => [...establishmentGroupKeys.details(), id] as const,

  checkDeletion: (id: number) =>
    [...establishmentGroupKeys.details(), id, "check-deletion"] as const,
};

// ----------------------------------------------------------------------------

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

export const fetchEstablishmentGroupsQueryOptions = (
  fetch: Fetch<PaginatedResponse<EstablishmentGroup>>,
  params: FetchEstablishmentGroupQueryParams = {},
) => {
  const queryFn = fetchEstablishmentGroups.bind(null, fetch, params);
  return queryOptions({
    queryKey: establishmentGroupKeys.list(params),
    queryFn,
    staleTime: DEFAULT_STALE_TIME,
  });
};

// ----------------------------------------------------------------------------

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

export const searchEstablishmentGroupsQueryOptions = (
  fetch: Fetch<SearchResponse<EstablishmentGroup>>,
  params: SearchEstablishmentGroupSearchParams = {},
) => {
  const queryFn = searchEstablishmentGroups.bind(null, fetch, params);
  return queryOptions({
    queryKey: establishmentGroupKeys.search(params),
    queryFn,
    staleTime: DEFAULT_STALE_TIME,
  });
};

// ----------------------------------------------------------------------------

export const createEstablishmentGroup = async (
  fetch: Fetch<EstablishmentGroup>,
  payload: CreateEstablishmentGroupPayload,
): Promise<EstablishmentGroup> => {
  const { data } = await fetch(`${ESTABLISHMENT_GROUP_API_URL}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
};

export const createEstablishmentGroupMutationOptions = (
  fetch: Fetch<EstablishmentGroup>,
) =>
  mutationOptions({
    mutationFn: (payload: CreateEstablishmentGroupPayload) =>
      createEstablishmentGroup(fetch, payload),
  });

// ----------------------------------------------------------------------------

export const updateEstablishmentGroup = async (
  fetch: Fetch<EstablishmentGroup>,
  id: number,
  payload: UpdateEstablishmentGroupPayload,
): Promise<EstablishmentGroup> => {
  const { data } = await fetch(`${ESTABLISHMENT_GROUP_API_URL}/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data;
};

export const updateEstablishmentGroupMutationOptions = (
  fetch: Fetch<EstablishmentGroup>,
) =>
  mutationOptions({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateEstablishmentGroupPayload;
    }) => updateEstablishmentGroup(fetch, id, payload),
  });

// ----------------------------------------------------------------------------

export const checkDeleteEstablishmentGroup = async (
  fetch: Fetch<CheckDeleteEstablishmentGroupData>,
  id: number,
): Promise<CheckDeleteEstablishmentGroupData> => {
  const { data } = await fetch(
    `${ESTABLISHMENT_GROUP_API_URL}/${id}/check_before_deletion/`,
  );
  return data;
};

export const checkDeleteEstablishmentGroupQueryOptions = (
  fetch: Fetch<CheckDeleteEstablishmentGroupData>,
  id: number,
) => {
  const queryFn = checkDeleteEstablishmentGroup.bind(null, fetch, id);
  return queryOptions({
    queryKey: establishmentGroupKeys.checkDeletion(id),
    queryFn,
  });
};

// ----------------------------------------------------------------------------

export const deleteEstablishmentGroup = async (
  fetch: Fetch<void>,
  id: number,
): Promise<void> => {
  await fetch(
    `${ESTABLISHMENT_GROUP_API_URL}/${id}/perform_destroy_with_side_effects/`,
    { method: "DELETE" },
  );
};

export const deleteEstablishmentGroupMutationOptions = (fetch: Fetch<void>) =>
  mutationOptions({
    mutationFn: (id: number) => deleteEstablishmentGroup(fetch, id),
  });
