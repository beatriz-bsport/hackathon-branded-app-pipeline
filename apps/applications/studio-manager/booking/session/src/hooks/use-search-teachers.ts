import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import {
  type FetchTeachersParams,
  type FuzzySearchTeacherParams,
  fuzzySearchTeachers,
} from "@bsport/api-core";

import { fetch } from "../utils/fetch";

const TEACHERS_DEFAULT_PAGE_SIZE = 20;
const TEACHERS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const searchTeachers = async (params: FuzzySearchTeacherParams) => {
  const result = await fuzzySearchTeachers(fetch, params);
  return result.results;
};

const teachersQueryOptions = (
  searchValue: string,
  params?: FetchTeachersParams,
) => {
  return queryOptions({
    queryKey: ["teachers", searchValue, params],
    queryFn: () =>
      searchTeachers({
        queryString: searchValue,
        page: 1,
        page_size: TEACHERS_DEFAULT_PAGE_SIZE,
        disabled: false,
        ...params,
      }),
    staleTime: TEACHERS_STALE_TIME,
  });
};

export const useSearchTeachers = (
  searchValue: string,
  params?: FetchTeachersParams,
) => {
  return useQuery({
    ...teachersQueryOptions(searchValue, params),
    placeholderData: keepPreviousData,
    select: (teachers) =>
      teachers?.map((teacher) => ({
        id: `${teacher.id}`,
        label: teacher.name,
      })) || [],
  });
};
