import { useQuery } from "@tanstack/react-query";

import { useRetrieveSeriesQuery } from "#src/hooks/series/use-retrieve-series-query";
import { sessionsInGroupQueryOptions } from "#src/hooks/session-api/fetch/use-fetch-sessions-in-group";

const SERIES_DETAILS_CLASSES_PAGE = 1;
const DEFAULT_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const useSeriesDetailsQuery = (seriesId: number | null) => {
  const seriesQuery = useRetrieveSeriesQuery(seriesId);
  const series = seriesQuery.data;

  const isSeriesReady = seriesId !== null && !!series;

  const classesQuery = useQuery({
    ...sessionsInGroupQueryOptions(
      seriesId,
      {
        ordering: "date_start",
        page: SERIES_DETAILS_CLASSES_PAGE,
        page_size: Math.max(series?.offers.length ?? 0, 1),
      },
      isSeriesReady,
    ),
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    classes: classesQuery.data?.results ?? [],
    error: seriesQuery.error ?? classesQuery.error,
    refetch: () => {
      void seriesQuery.refetch();
      void classesQuery.refetch();
    },
    series,
    isLoading:
      seriesQuery.isLoading || (isSeriesReady && classesQuery.isLoading),
  };
};
