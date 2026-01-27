import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import {
  type SearchGroupActivitiesParams,
  searchGroupActivitiesAndWorkshopsAPI,
} from "@bsport/api-book";

import { fetch } from "../utils/fetch";

const ACTIVITIES_DEFAULT_PAGE_SIZE = 20;
const ACTIVITIES_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const searchActivities = async (params: SearchGroupActivitiesParams) => {
  const result = await searchGroupActivitiesAndWorkshopsAPI(fetch, params);
  return result.results;
};

const activitiesQueryOptions = (searchValue: string) => {
  return queryOptions({
    queryKey: ["activities_and_workshops", searchValue],
    queryFn: () =>
      searchActivities({
        searchQuery: searchValue,
        page: 1,
        pageSize: ACTIVITIES_DEFAULT_PAGE_SIZE,
        customerEnabled: true,
      }),
    staleTime: ACTIVITIES_STALE_TIME,
  });
};

export const useSearchActivities = (searchValue: string) => {
  return useQuery({
    ...activitiesQueryOptions(searchValue),
    placeholderData: keepPreviousData,
    select: (activities) =>
      activities?.map((activity) => ({
        id: `${activity.id}`,
        label: activity.name,
      })) || [],
  });
};
