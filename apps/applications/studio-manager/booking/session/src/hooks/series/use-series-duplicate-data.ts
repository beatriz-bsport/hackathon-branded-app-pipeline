import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useFetchLevels } from "#src/hooks/level/useFetchLevels";
import { useRetrieveSeriesQuery } from "#src/hooks/series/use-retrieve-series-query";
import { sessionsInGroupQueryOptions } from "#src/hooks/session-api/fetch/use-fetch-sessions-in-group";
import { useFetchActivitiesByIds } from "#src/hooks/use-fetch-activities-by-ids";

const SERIES_DUPLICATE_CLASSES_PAGE = 1;

export const useSeriesDuplicateData = (seriesId: number) => {
  const seriesQuery = useRetrieveSeriesQuery(seriesId);
  const series = seriesQuery.data;
  const isSeriesReady = !!series;

  const allClassesQuery = useQuery(
    sessionsInGroupQueryOptions(
      seriesId,
      {
        ordering: "date_start",
        page: SERIES_DUPLICATE_CLASSES_PAGE,
        page_size: Math.max(series?.offers.length ?? 0, 1),
      },
      isSeriesReady,
    ),
  );

  const classes = useMemo(
    () => allClassesQuery.data?.results ?? [],
    [allClassesQuery.data?.results],
  );

  const activityIds = useMemo(
    () => (series ? [series.meta_activity] : []),
    [series],
  );
  const activityQuery = useFetchActivitiesByIds(activityIds, isSeriesReady);
  const levelsQuery = useFetchLevels(series?.company);

  return {
    activity: series ? activityQuery.data?.[series.meta_activity] : undefined,
    activityQuery,
    allClassesQuery,
    classes,
    level: series ? levelsQuery.data?.[series.level] : undefined,
    levelsQuery,
    series,
    seriesQuery,
  };
};
