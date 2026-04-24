import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import {
  type Video,
  fetchVideosQueryOptions,
} from "@bsport/api-buyables/video";
import { useDebounce } from "@bsport/use-debounce";

import { fetch } from "#src/utils/fetch";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 50;
const SEARCH_DEBOUNCE_DELAY_MS = 300;

type UseSearchVideosQueryOptions = {
  existingVideoIds: number[];
  isEnabled: boolean;
  searchTerm: string;
};

export const useSearchVideosQuery = ({
  existingVideoIds,
  isEnabled,
  searchTerm,
}: UseSearchVideosQueryOptions) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const debouncedSetSearchTerm = useDebounce(
    setDebouncedSearchTerm,
    SEARCH_DEBOUNCE_DELAY_MS,
  );

  useEffect(() => {
    const trimmedSearchTerm = searchTerm.trim();

    if (!isEnabled || trimmedSearchTerm === "") {
      setDebouncedSearchTerm("");
      return;
    }

    debouncedSetSearchTerm(trimmedSearchTerm);
  }, [isEnabled, searchTerm, debouncedSetSearchTerm]);

  const hasSearchTerm = debouncedSearchTerm.length > 0;

  const query = useQuery({
    ...fetchVideosQueryOptions(fetch, {
      mine: true,
      page: DEFAULT_PAGE,
      page_size: DEFAULT_PAGE_SIZE,
      search: debouncedSearchTerm,
    }),
    enabled: isEnabled && hasSearchTerm,
  });

  const existingVideoIdsSet = useMemo(
    () => new Set(existingVideoIds),
    [existingVideoIds],
  );

  const videos = useMemo<Video[]>(
    () =>
      (query.data?.results ?? []).filter(
        (video) => !existingVideoIdsSet.has(video.id),
      ),
    [existingVideoIdsSet, query.data?.results],
  );

  return {
    hasSearchTerm,
    videos,
    isLoading: query.isLoading,
  };
};
