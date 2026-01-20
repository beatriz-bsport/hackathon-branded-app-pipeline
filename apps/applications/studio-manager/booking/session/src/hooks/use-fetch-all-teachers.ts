import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchFlatTeachers } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

const TEACHERS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchTeachers = fetchFlatTeachers.bind(null, fetch);

const allTeachersQueryOptions = (companyId?: number, enabled = true) => {
  return queryOptions({
    queryKey: ["teachers", "all", companyId],
    queryFn: () => fetchTeachers({ company: companyId }),
    enabled: enabled,
    staleTime: TEACHERS_STALE_TIME,
  });
};

export const useFetchAllTeachers = (companyId?: number, enabled = true) => {
  return useQuery({
    ...allTeachersQueryOptions(companyId, enabled),
  });
};
