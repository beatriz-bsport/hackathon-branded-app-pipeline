import { queryOptions, useQuery } from "@tanstack/react-query";
import keyBy from "lodash/keyBy";

import {
  FetchTeachersParams,
  Teacher,
  fetchFlatTeachers,
  teacherKeys,
} from "@bsport/api-book";

import { fetch } from "../utils/fetch";

const TEACHERS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchTeachers = fetchFlatTeachers.bind(null, fetch);

const teachersQueryOptions = (
  teacherIds: number[],
  enabled: boolean,
  params: FetchTeachersParams,
) => {
  const teacherIdsSorted = [...teacherIds].sort();
  const queryParams = { id__in: teacherIdsSorted, ...params };
  return queryOptions({
    queryKey: teacherKeys.list(queryParams),
    queryFn: () => fetchTeachers(queryParams),
    enabled: enabled && teacherIdsSorted.length > 0,
    staleTime: TEACHERS_STALE_TIME,
  });
};

export const useFetchTeachers = <T = Record<string, Teacher>>(
  teacherIds: number[] = [],
  enabled = true,
  params: FetchTeachersParams = {},
  select?: (teacher: Teacher[]) => T,
) => {
  return useQuery({
    ...teachersQueryOptions(teacherIds, enabled, params),
    select: select ?? ((teachers) => keyBy(teachers, "id") as T),
  });
};
