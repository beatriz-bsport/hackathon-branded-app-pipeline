import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  type MetaActivity,
  type SearchGroupActivitiesParams,
  searchGroupActivitiesAndWorkshopsQueryOptions,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const DEFAULT_PAGE_SIZE = 20;

export const selectWorkshopActivityFilterItems = (activities: {
  results: MetaActivity[];
}) => {
  return activities.results.map((activity) => ({
    id: `${activity.id}`,
    label: activity.name,
  }));
};

const getWorkshopActivitySearchParams = (
  searchValue: string,
): SearchGroupActivitiesParams => ({
  searchQuery: searchValue,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  customerEnabled: true,
  isWorkshop: true,
});

export const useSearchWorkshopActivities = (
  searchValue: string,
  enabled = true,
) => {
  return useQuery({
    ...searchGroupActivitiesAndWorkshopsQueryOptions(
      fetch,
      getWorkshopActivitySearchParams(searchValue),
    ),
    enabled,
    placeholderData: keepPreviousData,
    select: selectWorkshopActivityFilterItems,
  });
};
