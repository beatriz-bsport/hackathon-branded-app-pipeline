import { queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL, QUERY_KEY_MAIN } from "#src/constants";

import type { FetchVideosByIdsParams, Video } from "./types";

const API_URL = `${API_V1_URL}/vod/video`;

// #region Query Keys

export const videoKeys = {
  all: [QUERY_KEY_MAIN, "video"] as const,

  byIdsLists: () => [...videoKeys.all, "by-ids"] as const,
  byIds: (params: FetchVideosByIdsParams) =>
    [...videoKeys.byIdsLists(), params] as const,
} as const;

// #endregion

const fetchVideosByIdsAPIConfig = (
  params: FetchVideosByIdsParams,
): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(params)}`];
};

export const fetchVideosByIdsAPI = async (
  fetch: Fetch<PaginatedResponse<Video>>,
  params: FetchVideosByIdsParams,
): Promise<Video[]> => {
  if (params.id__in.length === 0) {
    return [];
  }

  const [uri, init] = fetchVideosByIdsAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data.results ?? [];
};

export const fetchVideosByIdsQueryOptions = (
  fetch: Fetch<PaginatedResponse<Video>>,
  params: FetchVideosByIdsParams,
) =>
  queryOptions({
    queryKey: videoKeys.byIds(params),
    queryFn: () => fetchVideosByIdsAPI(fetch, params),
  });
