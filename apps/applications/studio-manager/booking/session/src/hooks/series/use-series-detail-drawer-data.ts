import { keepPreviousData, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

import type { Session } from "@bsport/api-book";

import { useFetchLevels } from "#src/hooks/level/useFetchLevels";
import { useRetrieveSeriesQuery } from "#src/hooks/series/use-retrieve-series-query";
import { sessionsInGroupQueryOptions } from "#src/hooks/session-api/fetch/use-fetch-sessions-in-group";
import { useFetchActivitiesByIds } from "#src/hooks/use-fetch-activities-by-ids";
import { useFetchTeachers } from "#src/hooks/useFetchTeachers";

const SERIES_DETAIL_DRAWER_CLASSES_PAGE = 1;
const SERIES_DETAIL_DRAWER_CLASSES_PAGE_SIZE = 10;

const getUniqueTeacherIds = (classes: Session[]) => {
  const teacherIds = new Set<number>();

  classes.forEach((sessionClass) => {
    teacherIds.add(sessionClass.coach);

    if (sessionClass.coach_override !== null) {
      teacherIds.add(sessionClass.coach_override);
    }
  });

  return Array.from(teacherIds);
};

type UseSeriesDetailDrawerDataParams = {
  classesPreviewPage?: number;
  seriesId: number | null;
};

export const useSeriesDetailDrawerData = ({
  classesPreviewPage = SERIES_DETAIL_DRAWER_CLASSES_PAGE,
  seriesId,
}: UseSeriesDetailDrawerDataParams) => {
  const seriesQuery = useRetrieveSeriesQuery(seriesId);
  const series = seriesQuery.data;
  const isSeriesReady = seriesId !== null && !!series;

  // we need facts: first/last non-cancelled class, status
  // counts, cancelled-series detection, and the More details target class.
  // This fetches every class for now; a better backend contract would return
  // those aggregates directly, including status counts and date bounds.
  const [allClassesQuery, previewClassesQuery] = useQueries({
    queries: [
      sessionsInGroupQueryOptions(
        seriesId,
        {
          ordering: "date_start",
          page: SERIES_DETAIL_DRAWER_CLASSES_PAGE,
          page_size: Math.max(series?.offers.length ?? 0, 1),
        },
        isSeriesReady,
      ),
      {
        ...sessionsInGroupQueryOptions(
          seriesId,
          {
            ordering: "date_start",
            page: classesPreviewPage,
            page_size: SERIES_DETAIL_DRAWER_CLASSES_PAGE_SIZE,
          },
          seriesId !== null,
        ),
        placeholderData: keepPreviousData,
      },
    ],
  });

  const activityIds = useMemo(
    () => (series ? [series.meta_activity] : []),
    [series],
  );
  const activityQuery = useFetchActivitiesByIds(activityIds, isSeriesReady);
  const levelsQuery = useFetchLevels(series?.company);

  const previewClasses = useMemo(
    () => previewClassesQuery.data?.results ?? [],
    [previewClassesQuery.data?.results],
  );

  const teacherIds = useMemo(
    () => getUniqueTeacherIds(previewClasses),
    [previewClasses],
  );

  // on fetch teachers when the preview classes are loaded
  const teachersQuery = useFetchTeachers(
    teacherIds,
    previewClassesQuery.isSuccess,
  );

  return {
    activity: series ? activityQuery.data?.[series.meta_activity] : undefined,
    activityQuery,
    allClasses: allClassesQuery.data?.results ?? [],
    allClassesQuery,
    level: series ? levelsQuery.data?.[series.level] : undefined,
    levelsQuery,
    previewClasses,
    previewClassesQuery,
    series,
    seriesQuery,
    teachersById: teachersQuery.data ?? {},
    teachersQuery,
  };
};
