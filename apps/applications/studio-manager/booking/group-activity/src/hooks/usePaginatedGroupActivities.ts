import { useMemo } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  type FetchGroupActivitiesParams,
  type SearchGroupActivitiesParams,
  fetchGroupActivitiesAction,
  searchGroupActivitiesAction,
  selectCount,
  selectCurrentGroupActivities,
  selectSearchedGroupActivities,
  useGroupActivityStore,
} from "@bsport/store-booking-group-activity";
import { useAsync } from "@bsport/use-async";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

type ConfigurableSearchParams = Pick<
  SearchGroupActivitiesParams,
  "inCategoryIds" | "notInCategoryIds" | "searchQuery"
>;

// DUPLICATED IN apps/applications/studio-manager/booking/session/src/hooks/usePaginatedGroupActivities.ts
export const usePaginatedGroupActivities = ({
  customerEnabled,
}: {
  customerEnabled: boolean;
}) => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const groupActivities = useGroupActivityStore(selectCurrentGroupActivities);

  const searchedGroupActivities = useGroupActivityStore(
    selectSearchedGroupActivities,
  );

  const totalItems = useGroupActivityStore(selectCount);

  const _fetchGroupActivities = (params?: FetchGroupActivitiesParams) =>
    fetchGroupActivitiesAction(fetch, {
      customerEnabled,
      page: currentPage,
      pageSize: currentPageSize,
      ...(params ?? {}),
    });

  const [{ isLoading: isFetchLoading }, fetchGroupActivities] = useAsync<
    typeof _fetchGroupActivities
  >({
    asyncFn: _fetchGroupActivities,
    dependencies: [currentPage, currentPageSize, customerEnabled],
  });

  const _searchGroupActivitiesPage = (params?: ConfigurableSearchParams) =>
    searchGroupActivitiesAction(fetch, {
      customerEnabled,
      page: currentPage,
      pageSize: currentPageSize,
      ...(params ?? {}),
    });

  const [{ isLoading: isSearchLoading }, searchGroupActivitiesPage] = useAsync<
    typeof _searchGroupActivitiesPage
  >({
    asyncFn: _searchGroupActivitiesPage,
    dependencies: [currentPage, currentPageSize, customerEnabled],
  });

  const isLoading = isFetchLoading || isSearchLoading;

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
    searchedGroupActivities,
    searchGroupActivitiesPage,
    fetchGroupActivities,
    paginationProps,
    isLoading,
  };
};
