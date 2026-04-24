import { queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL, QUERY_KEY_MAIN } from "#src/constants";

import type { FetchVideoViewsParams, VideoView } from "./types";

const API_URL = `${API_V1_URL}/vod/video_view_analytics`;

export const videoViewKeys = {
  all: [QUERY_KEY_MAIN, "video-view"] as const,

  lists: () => [...videoViewKeys.all, "list"] as const,
  list: (params: FetchVideoViewsParams) =>
    [...videoViewKeys.lists(), params] as const,
} as const;

const fetchVideoViewsAPIConfig = (params: FetchVideoViewsParams): ApiConfig => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  ) as FetchVideoViewsParams;
  return [`${API_URL}/${buildUrlParams(cleanedParams)}`];
};

export const fetchVideoViewsAPI = async (
  fetch: Fetch<PaginatedResponse<VideoView>>,
  params: FetchVideoViewsParams,
): Promise<PaginatedResponse<VideoView>> => {
  const [uri, init] = fetchVideoViewsAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchVideoViewsQueryOptions = (
  fetch: Fetch<PaginatedResponse<VideoView>>,
  params: FetchVideoViewsParams,
) =>
  queryOptions({
    queryKey: videoViewKeys.list(params),
    queryFn: () => fetchVideoViewsAPI(fetch, params),
  });
