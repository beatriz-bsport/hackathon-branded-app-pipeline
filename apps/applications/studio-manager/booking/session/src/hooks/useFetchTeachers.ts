import { queryOptions, useQuery } from "@tanstack/react-query";
import { keyBy } from "lodash";

import { fetchTeachers } from "../api";

const teachersQueryOptions = (teacherIds: number[], enabled: boolean) =>
  queryOptions({
    queryKey: ["teachers", [...teacherIds].sort().join(",")],
    queryFn: () => fetchTeachers(teacherIds),
    enabled: enabled && teacherIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

export const useFetchTeachers = (teacherIds: number[] = [], enabled = true) => {
  return useQuery({
    ...teachersQueryOptions(teacherIds, enabled),
    select: (teachers) => keyBy(teachers, "id"),
  });
};
