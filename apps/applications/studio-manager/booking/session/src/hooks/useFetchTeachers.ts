import { queryOptions, useQuery } from "@tanstack/react-query";
import keyBy from "lodash/keyBy";

import { fetchFlatTeachers } from "@bsport/api-core";

import { fetch } from "../utils/fetch";

const TEACHERS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchTeachers = fetchFlatTeachers.bind(null, fetch);

const teachersQueryOptions = (teacherIds: number[], enabled: boolean) => {
  const teacherIdsSorted = [...teacherIds].sort();
  return queryOptions({
    queryKey: ["teachers", teacherIdsSorted],
    queryFn: () => fetchTeachers({ id__in: teacherIdsSorted }),
    enabled: enabled && teacherIdsSorted.length > 0,
    staleTime: TEACHERS_STALE_TIME,
  });
};

export const useFetchTeachers = (teacherIds: number[] = [], enabled = true) => {
  return useQuery({
    ...teachersQueryOptions(teacherIds, enabled),
    select: (teachers) => keyBy(teachers, "id"),
  });
};
