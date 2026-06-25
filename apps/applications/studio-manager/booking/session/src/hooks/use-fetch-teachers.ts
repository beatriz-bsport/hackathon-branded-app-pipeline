import { queryOptions, useQuery } from "@tanstack/react-query";
import first from "lodash/first";

import {
  FetchTeachersParams,
  fetchFlatTeachers,
  teacherKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const TEACHERS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchTeachers = fetchFlatTeachers.bind(null, fetch);

export const allTeachersQueryOptions = (params: FetchTeachersParams = {}) => {
  return queryOptions({
    queryKey: teacherKeys.list(params),
    queryFn: () => fetchTeachers(params),
    enabled: Boolean(params.company),
    staleTime: TEACHERS_STALE_TIME,
  });
};

export const useFetchTeachers = (params: FetchTeachersParams = {}) => {
  return useQuery({
    ...allTeachersQueryOptions(params),
  });
};

const teacherQueryOptions = (id?: number) => {
  const params: FetchTeachersParams = { id__in: id ? [id] : [] };
  return queryOptions({
    queryKey: teacherKeys.list(params),
    queryFn: () => fetchTeachers(params),
    enabled: Boolean(id),
    staleTime: TEACHERS_STALE_TIME,
    select: (teacher) => first(teacher),
  });
};

export const useFetchTeacher = (id?: number) => {
  return useQuery({
    ...teacherQueryOptions(id),
  });
};

export default useFetchTeachers;
