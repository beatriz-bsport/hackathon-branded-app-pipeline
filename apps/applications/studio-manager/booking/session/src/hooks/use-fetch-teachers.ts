import { queryOptions, useQuery } from "@tanstack/react-query";
import first from "lodash/first";

import { FetchTeachersParams, fetchFlatTeachers } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

const TEACHERS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchTeachers = fetchFlatTeachers.bind(null, fetch);

const allTeachersQueryOptions = (params: FetchTeachersParams = {}) => {
  return queryOptions({
    queryKey: ["teachers", params],
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
  return queryOptions({
    queryKey: ["teachers", id],
    queryFn: () => fetchTeachers({ id__in: id ? [id] : [] }),
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
