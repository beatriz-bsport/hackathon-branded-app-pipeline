import { useQuery } from "@tanstack/react-query";

import { type Teacher, fetchFlatTeachers, teacherKeys } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const TEACHERS_STALE_TIME = 2 * 60 * 1000;

const fetchTeachers = fetchFlatTeachers.bind(null, fetch);

export const useFetchCompanyTeachers = (
  companyId: number | undefined,
  enabled = true,
) => {
  const params = { company: companyId, disabled: false };
  return useQuery<Teacher[]>({
    queryKey: teacherKeys.company(companyId, params),
    queryFn: () => fetchTeachers(params),
    enabled: enabled && !!companyId,
    staleTime: TEACHERS_STALE_TIME,
  });
};
