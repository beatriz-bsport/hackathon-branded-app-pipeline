import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  type FetchGroupActivitiesParams,
  type SearchGroupActivitiesParams,
  fetchGroupActivitiesAndWorkshops,
  searchGroupActivitiesAndWorkshopsAPI,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

type ConfigurableSearchParams = {
  searchQuery?: string;
};

const DEFAULT_PAGE_SIZE = 20;
const GROUP_ACTIVITIES_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const infiniteGroupActivitiesQueryOptions = (
  params: FetchGroupActivitiesParams,
  enabled: boolean,
) =>
  infiniteQueryOptions({
    queryKey: ["groupActivities", "infinite", params],
    queryFn: async ({ pageParam }) => {
      return fetchGroupActivitiesAndWorkshops(fetch, {
        ...params,
        page: pageParam,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
    enabled,
    staleTime: GROUP_ACTIVITIES_STALE_TIME,
  });

const infiniteSearchGroupActivitiesQueryOptions = (
  params: SearchGroupActivitiesParams,
  enabled: boolean,
) =>
  infiniteQueryOptions({
    queryKey: ["searchGroupActivitiesAndWorkshops", "infinite", params],
    queryFn: async ({ pageParam }) => {
      return searchGroupActivitiesAndWorkshopsAPI(fetch, {
        ...params,
        page: pageParam,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.flatMap((p) => p.results).length;
      return loadedCount < lastPage.count ? allPages.length + 1 : undefined;
    },
    enabled,
    staleTime: GROUP_ACTIVITIES_STALE_TIME,
  });

export const useInfiniteGroupActivities = ({
  customerEnabled,
  isWorkshop,
  searchParams,
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  customerEnabled: boolean;
  isWorkshop?: boolean;
  searchParams?: ConfigurableSearchParams;
  pageSize?: number;
}) => {
  const isSearchMode = !!searchParams?.searchQuery;

  const baseParams: FetchGroupActivitiesParams = {
    customerEnabled,
    ...(isWorkshop !== undefined && { isWorkshop }),
    pageSize,
  };

  const searchQueryParams: SearchGroupActivitiesParams = {
    ...baseParams,
    searchQuery: searchParams?.searchQuery ?? "",
  };

  const {
    data: fetchData,
    isLoading: isFetchLoading,
    hasNextPage: hasFetchNextPage,
    fetchNextPage: fetchNextFetchPage,
    isFetchingNextPage: isFetchingNextFetchPage,
  } = useInfiniteQuery(
    infiniteGroupActivitiesQueryOptions(baseParams, !isSearchMode),
  );

  const {
    data: searchData,
    isLoading: isSearchLoading,
    hasNextPage: hasSearchNextPage,
    fetchNextPage: fetchNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
  } = useInfiniteQuery(
    infiniteSearchGroupActivitiesQueryOptions(searchQueryParams, isSearchMode),
  );

  const groupActivities = useMemo(() => {
    const pages = isSearchMode ? searchData?.pages : fetchData?.pages;
    return pages?.flatMap((page) => page.results) ?? [];
  }, [isSearchMode, searchData, fetchData]);

  const totalItems = isSearchMode
    ? (searchData?.pages[0]?.count ?? 0)
    : (fetchData?.pages[0]?.count ?? 0);

  const isLoading = isSearchMode ? isSearchLoading : isFetchLoading;

  const isFetchingNextPage = isSearchMode
    ? isFetchingNextSearchPage
    : isFetchingNextFetchPage;

  const hasNextPage = isSearchMode ? hasSearchNextPage : hasFetchNextPage;

  const fetchNextPage = isSearchMode ? fetchNextSearchPage : fetchNextFetchPage;

  return {
    groupActivities,
    totalItems,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};
