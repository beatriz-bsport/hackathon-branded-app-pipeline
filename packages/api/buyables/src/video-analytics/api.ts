import { queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL, QUERY_KEY_MAIN } from "#src/constants";

import type {
  FetchVideoAnalyticsPerMemberParams,
  VideoAnalytics,
  VideoAnalyticsPerMember,
} from "./types";

const API_URL = `${API_V1_URL}/vod/video_analytics`;

export const videoAnalyticsKeys = {
  all: [QUERY_KEY_MAIN, "video-analytics"] as const,

  detail: (videoId: number) =>
    [...videoAnalyticsKeys.all, "detail", videoId] as const,

  perMemberLists: (videoId: number) =>
    [...videoAnalyticsKeys.all, "per-member", videoId] as const,
  perMember: (videoId: number, params: FetchVideoAnalyticsPerMemberParams) =>
    [...videoAnalyticsKeys.perMemberLists(videoId), params] as const,
} as const;

const fetchVideoAnalyticsAPIConfig = ({
  videoId,
}: {
  videoId: number;
}): ApiConfig => {
  return [`${API_URL}/${videoId}/`];
};

export const fetchVideoAnalyticsAPI = async (
  fetch: Fetch<VideoAnalytics>,
  params: { videoId: number },
): Promise<VideoAnalytics> => {
  const [uri, init] = fetchVideoAnalyticsAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchVideoAnalyticsQueryOptions = (
  fetch: Fetch<VideoAnalytics>,
  params: { videoId: number },
) =>
  queryOptions({
    queryKey: videoAnalyticsKeys.detail(params.videoId),
    queryFn: () => fetchVideoAnalyticsAPI(fetch, params),
  });

const fetchVideoAnalyticsPerMemberAPIConfig = (
  videoId: number,
  params: FetchVideoAnalyticsPerMemberParams,
): ApiConfig => {
  return [
    `${API_URL}/${videoId}/get_analytics_per_member/${buildUrlParams(params)}`,
  ];
};

export const fetchVideoAnalyticsPerMemberAPI = async (
  fetch: Fetch<PaginatedResponse<VideoAnalyticsPerMember>>,
  videoId: number,
  params: FetchVideoAnalyticsPerMemberParams,
): Promise<PaginatedResponse<VideoAnalyticsPerMember>> => {
  const [uri, init] = fetchVideoAnalyticsPerMemberAPIConfig(videoId, params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchVideoAnalyticsPerMemberQueryOptions = (
  fetch: Fetch<PaginatedResponse<VideoAnalyticsPerMember>>,
  videoId: number,
  params: FetchVideoAnalyticsPerMemberParams,
) =>
  queryOptions({
    queryKey: videoAnalyticsKeys.perMember(videoId, params),
    queryFn: () => fetchVideoAnalyticsPerMemberAPI(fetch, videoId, params),
  });
