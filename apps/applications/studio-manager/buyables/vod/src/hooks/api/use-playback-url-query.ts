import { useQuery } from "@tanstack/react-query";

import { fetchPlaybackUrlQueryOptions } from "@bsport/api-buyables/video";

import { fetch } from "#src/utils/fetch";

export const usePlaybackUrlQuery = (videoId: number | null) => {
  return useQuery({
    ...fetchPlaybackUrlQueryOptions(fetch, { id: videoId ?? 0 }),
    enabled: videoId !== null,
  });
};
