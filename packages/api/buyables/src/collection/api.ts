import { queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  type Xhr,
  type XhrApiConfig,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL, QUERY_KEY_MAIN } from "#src/constants";

import type {
  Collection,
  FetchCollectionsParams,
  UpdateCollectionParams,
} from "./types";

const API_URL = `${API_V1_URL}/vod/playlist`;

// #region Query Keys

export const collectionKeys = {
  all: [QUERY_KEY_MAIN, "collection"] as const,

  lists: () => [...collectionKeys.all, "list"] as const,
  list: (params: FetchCollectionsParams) =>
    [...collectionKeys.lists(), params] as const,

  details: () => [...collectionKeys.all, "detail"] as const,
  detail: (id: number) => [...collectionKeys.details(), id] as const,
} as const;

// #endregion

// #region List

const fetchCollectionsAPIConfig = (
  params: FetchCollectionsParams,
): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(params)}`];
};

const fetchCollectionsAPI = async (
  fetch: Fetch<PaginatedResponse<Collection>>,
  params: FetchCollectionsParams,
): Promise<PaginatedResponse<Collection>> => {
  const [uri, init] = fetchCollectionsAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchCollectionsQueryOptions = (
  fetch: Fetch<PaginatedResponse<Collection>>,
  params: FetchCollectionsParams,
) =>
  queryOptions({
    queryKey: collectionKeys.list(params),
    queryFn: () => fetchCollectionsAPI(fetch, params),
  });

// #endregion

// #region Detail

const fetchCollectionAPIConfig = ({ id }: { id: number }): ApiConfig => {
  return [`${API_URL}/${id}/`];
};

const fetchCollectionAPI = async (
  fetch: Fetch<Collection>,
  params: { id: number },
): Promise<Collection> => {
  const [uri, init] = fetchCollectionAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchCollectionQueryOptions = (
  fetch: Fetch<Collection>,
  params: { id: number },
) =>
  queryOptions({
    queryKey: collectionKeys.detail(params.id),
    queryFn: () => fetchCollectionAPI(fetch, params),
  });

// #endregion

// #region Create

const createCollectionAPIConfig = (data: FormData): XhrApiConfig => {
  return [`${API_URL}/`, { method: "POST", formData: data }];
};

export const createCollectionAPI = async (
  xhr: Xhr<Collection>,
  params: FormData,
): Promise<Collection> => {
  const [uri, init] = createCollectionAPIConfig(params);

  const { data } = await xhr(uri, init);

  return data;
};

// #endregion

// #region Update

const updateCollectionAPIConfig = ({
  id,
  data,
}: UpdateCollectionParams): XhrApiConfig => {
  return [`${API_URL}/${id}/`, { method: "PATCH", formData: data }];
};

export const updateCollectionAPI = async (
  xhr: Xhr<Collection>,
  params: UpdateCollectionParams,
): Promise<Collection> => {
  const [uri, init] = updateCollectionAPIConfig(params);

  const { data } = await xhr(uri, init);

  return data;
};

// #endregion

// #region Delete

const deleteCollectionAPIConfig = ({ id }: { id: number }): ApiConfig => {
  return [`${API_URL}/${id}/`, { method: "DELETE" }];
};

export const deleteCollectionAPI = async (
  fetch: Fetch<void>,
  params: { id: number },
): Promise<void> => {
  const [uri, init] = deleteCollectionAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

// #endregion
