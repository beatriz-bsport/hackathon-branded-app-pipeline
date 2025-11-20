import { useEffect } from "react";

import type { ActiveCategoryFilters } from "./useCategoryFilter";
import { usePaginatedGroupActivities } from "./usePaginatedGroupActivities";

/**
 * Custom hook that fetches group activities based on filters and search query.
 * - When filters or search query are active, it searches with those parameters
 * - When no filters are active, it fetches all group activities
 */
export const useFetchGroupActivities = ({
  searchQuery,
  activeCategoryFilters,
}: {
  searchQuery: string;
  activeCategoryFilters: ActiveCategoryFilters;
}) => {
  const { searchGroupActivitiesPage, fetchGroupActivities } =
    usePaginatedGroupActivities({ customerEnabled: true });

  const hasNoFilter =
    !searchQuery &&
    !activeCategoryFilters.is.length &&
    !activeCategoryFilters.isNot.length;

  useEffect(() => {
    if (!hasNoFilter) {
      searchGroupActivitiesPage({
        inCategoryIds: activeCategoryFilters.is,
        notInCategoryIds: activeCategoryFilters.isNot,
        searchQuery,
      });
    }
  }, [
    searchGroupActivitiesPage,
    activeCategoryFilters,
    searchQuery,
    hasNoFilter,
  ]);

  useEffect(() => {
    if (hasNoFilter) {
      fetchGroupActivities();
    }
  }, [fetchGroupActivities, hasNoFilter]);
};
