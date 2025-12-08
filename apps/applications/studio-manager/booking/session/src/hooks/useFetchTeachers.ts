import { queryOptions, useQuery } from "@tanstack/react-query";
import { keyBy } from "lodash";

import { fetchTeachers } from "../api";

const TEACHERS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const teachersQueryOptions = (teacherIds: number[], enabled: boolean) =>
  queryOptions({
    queryKey: ["teachers", [...teacherIds].sort().join(",")],
    queryFn: () => fetchTeachers(teacherIds),
    enabled: enabled && teacherIds.length > 0,
    staleTime: TEACHERS_STALE_TIME,
  });

export const useFetchTeachers = (teacherIds: number[] = [], enabled = true) => {
  return useQuery({
    ...teachersQueryOptions(teacherIds, enabled),
    select: (teachers) => keyBy(teachers, "id"),
  });
};
