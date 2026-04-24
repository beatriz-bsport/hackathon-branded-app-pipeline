import { queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL, QUERY_KEY_MAIN } from "#src/constants";

import type { FetchVideoPurchasesParams, VideoPurchase } from "./types";

const API_URL = `${API_V1_URL}/vod/video_purchase`;

export const videoPurchaseKeys = {
  all: [QUERY_KEY_MAIN, "video-purchase"] as const,

  lists: () => [...videoPurchaseKeys.all, "list"] as const,
  list: (params: FetchVideoPurchasesParams) =>
    [...videoPurchaseKeys.lists(), params] as const,
} as const;

const fetchVideoPurchasesAPIConfig = (
  params: FetchVideoPurchasesParams,
): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(params)}`];
};

export const fetchVideoPurchasesAPI = async (
  fetch: Fetch<PaginatedResponse<VideoPurchase>>,
  params: FetchVideoPurchasesParams,
): Promise<PaginatedResponse<VideoPurchase>> => {
  const [uri, init] = fetchVideoPurchasesAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchVideoPurchasesQueryOptions = (
  fetch: Fetch<PaginatedResponse<VideoPurchase>>,
  params: FetchVideoPurchasesParams,
) =>
  queryOptions({
    queryKey: videoPurchaseKeys.list(params),
    queryFn: () => fetchVideoPurchasesAPI(fetch, params),
  });
