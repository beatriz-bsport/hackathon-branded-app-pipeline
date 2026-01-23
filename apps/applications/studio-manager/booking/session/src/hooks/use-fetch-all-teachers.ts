import { queryOptions, useQuery } from "@tanstack/react-query";

import { FetchTeachersParams, fetchFlatTeachers } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

const TEACHERS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchTeachers = fetchFlatTeachers.bind(null, fetch);

const allTeachersQueryOptions = (params: FetchTeachersParams = {}) => {
  return queryOptions({
    queryKey: ["teachers", "all", params],
    queryFn: () => fetchTeachers(params),
    enabled: Boolean(params.company),
    staleTime: TEACHERS_STALE_TIME,
  });
};

export const useFetchAllTeachers = (params: FetchTeachersParams = {}) => {
  return useQuery({
    ...allTeachersQueryOptions(params),
  });
};
