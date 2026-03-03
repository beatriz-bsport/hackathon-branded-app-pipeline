import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";

import {
  type FetchGroupActivitiesParams,
  type SearchGroupActivitiesParams,
  searchGroupActivitiesAndWorkshopsAPI,
} from "@bsport/api-book";
import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { useObjectLevelPermission } from "#src/utils/permission";

import { fetch } from "../utils/fetch";

type ConfigurableSearchParams = {
  searchQuery?: string;
};

const GROUP_ACTIVITIES_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const searchGroupActivitiesQueryOptions = (
  params: SearchGroupActivitiesParams,
) =>
  queryOptions({
    queryKey: ["searchGroupActivitiesAndWorkshops", params],
    queryFn: async () => {
      const data = await searchGroupActivitiesAndWorkshopsAPI(fetch, params);
      return data;
    },
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
  const hasCreateActivitySessionsPermission = useObjectLevelPermission(
    "session.activity.allowed_actions.create",
  );
  const hasCreateWorkshopSessionsPermission = useObjectLevelPermission(
    "session.workshop.allowed_actions.create",
  );

  const isWorkshop =
    hasCreateActivitySessionsPermission && hasCreateWorkshopSessionsPermission
      ? undefined
      : hasCreateActivitySessionsPermission
        ? false
        : true;

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const fetchParams: FetchGroupActivitiesParams = {
    customerEnabled,
    ...(isWorkshop !== undefined && { isWorkshop }),
    page: currentPage,
    pageSize: currentPageSize,
  };

  const searchQueryParams: SearchGroupActivitiesParams = {
    ...fetchParams,
    searchQuery: searchParams?.searchQuery ?? "",
  };

  const { data: searchData, isLoading } = useQuery(
    searchGroupActivitiesQueryOptions(searchQueryParams),
  );

  const groupActivities = searchData?.results ?? [];
  const totalItems = searchData?.count ?? 0;

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
