import { useMemo } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  type MetaActivity,
  type SearchGroupActivitiesParams,
  searchGroupActivitiesAction,
  useGroupActivityStore,
} from "@bsport/store-booking-group-activity";
import { useAsync } from "@bsport/use-async";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

type ConfigurableSearchParams = Pick<
  SearchGroupActivitiesParams,
  "inCategoryIds" | "notInCategoryIds" | "searchQuery"
>;

export const usePaginatedGroupActivities = (customerEnabled: boolean) => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const { count: totalItems, byId, ids } = useGroupActivityStore();
  const groupActivities = useMemo<MetaActivity[]>(
    () => ids.map((id) => byId[id]),
    [byId, ids],
  );

  const _searchGroupActivitiesPage = (params?: ConfigurableSearchParams) =>
    searchGroupActivitiesAction(fetch, {
      customerEnabled,
      page: currentPage,
      pageSize: currentPageSize,
      ...(params ?? {}),
    });

  const [{ isLoading }, searchGroupActivitiesPage] = useAsync<
    typeof _searchGroupActivitiesPage
  >({
    asyncFn: _searchGroupActivitiesPage,
    dependencies: [currentPage, currentPageSize, customerEnabled],
  });

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
    searchGroupActivitiesPage,
    paginationProps,
    isLoading,
  };
};
