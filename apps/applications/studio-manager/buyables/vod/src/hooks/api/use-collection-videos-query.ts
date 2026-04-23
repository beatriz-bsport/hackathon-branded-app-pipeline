import { useQuery } from "@tanstack/react-query";

import {
  type Video,
  fetchVideosByIdsQueryOptions,
} from "@bsport/api-buyables/video";

import { fetch } from "#src/utils/fetch";

const PAGE_SIZE = 200;

export const useCollectionVideosQuery = (videos: number[] | undefined) => {
  const videoIds = Array.from(new Set(videos ?? []));

  return useQuery({
    ...fetchVideosByIdsQueryOptions(fetch, {
      id__in: videoIds,
      page_size: PAGE_SIZE,
    }),
    enabled: videoIds.length > 0,
    select: (fetchedVideos: Video[]) => {
      const videosById = new Map(
        fetchedVideos.map((video) => [video.id, video] as const),
      );

      return videoIds
        .map((videoId) => videosById.get(videoId))
        .filter((video): video is Video => Boolean(video));
    },
  });
};
