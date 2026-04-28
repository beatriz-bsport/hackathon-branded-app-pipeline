import { useSuspenseQuery } from "@tanstack/react-query";

import { fetchVideoAnalyticsQueryOptions } from "@bsport/api-buyables/video-analytics";

import { fetch } from "#src/utils/fetch";

export const useVideoAnalyticsQuery = (videoId: number) =>
  useSuspenseQuery(fetchVideoAnalyticsQueryOptions(fetch, { videoId }));
