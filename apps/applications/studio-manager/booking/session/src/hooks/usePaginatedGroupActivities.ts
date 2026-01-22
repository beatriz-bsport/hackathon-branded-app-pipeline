import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";

import {
  type FetchGroupActivitiesParams,
  type SearchGroupActivitiesParams,
  fetchGroupActivitiesAndWorkshops,
  searchGroupActivitiesAndWorkshopsAPI,
} from "@bsport/api-book";
import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { fetch } from "../utils/fetch";

type ConfigurableSearchParams = {
  searchQuery?: string;
};

const GROUP_ACTIVITIES_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const groupActivitiesQueryOptions = (
  params: FetchGroupActivitiesParams,
  enabled: boolean,
) =>
  queryOptions({
    queryKey: ["groupActivities", params],
    queryFn: async () => {
      const data = await fetchGroupActivitiesAndWorkshops(fetch, params);
      return data;
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: GROUP_ACTIVITIES_STALE_TIME,
  });

const searchGroupActivitiesQueryOptions = (
  params: SearchGroupActivitiesParams,
  enabled: boolean,
) =>
  queryOptions({
    queryKey: ["searchGroupActivitiesAndWorkshops", params],
    queryFn: async () => {
      const data = await searchGroupActivitiesAndWorkshopsAPI(fetch, params);
      return data;
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: GROUP_ACTIVITIES_STALE_TIME,
  });

export const usePaginatedGroupActivities = ({
  customerEnabled,
  searchParams,
}: {
  customerEnabled: boolean;
  searchParams?: ConfigurableSearchParams;
}) => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const isSearchMode = !!searchParams?.searchQuery;

  const fetchParams: FetchGroupActivitiesParams = {
    customerEnabled,
    page: currentPage,
    pageSize: currentPageSize,
  };

  const searchQueryParams: SearchGroupActivitiesParams = {
    ...fetchParams,
    searchQuery: searchParams?.searchQuery ?? "",
  };

  const { data: fetchData, isLoading: isFetchLoading } = useQuery(
    groupActivitiesQueryOptions(fetchParams, !isSearchMode),
  );

  const { data: searchData, isLoading: isSearchLoading } = useQuery(
    searchGroupActivitiesQueryOptions(searchQueryParams, isSearchMode),
  );

  const activeData = isSearchMode ? searchData : fetchData;
  const isLoading = isFetchLoading || isSearchLoading;

  const groupActivities = activeData?.results ?? [];
  const totalItems = activeData?.count ?? 0;

  const paginationProps: PaginationProps = useMemo(
    () => ({
      currentPage,
      rowsPerPage: currentPageSize,
      showRowsPerPageSelector: true,
      disabled: isLoading,
      totalItems,
      onPageSettingsChange: setPageSettings,
      className: "p-md",
    }),
    [currentPage, currentPageSize, isLoading, totalItems, setPageSettings],
  );

  return {
    groupActivities,
    paginationProps,
    isLoading,
  };
};
