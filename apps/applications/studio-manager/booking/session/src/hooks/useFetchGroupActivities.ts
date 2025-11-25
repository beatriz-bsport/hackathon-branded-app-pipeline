import { useEffect } from "react";

import { usePaginatedGroupActivities } from "./usePaginatedGroupActivities";

/**
 * DUPLICATED IN apps/applications/studio-manager/booking/group-activity/src/hooks/useFetchGroupActivities.ts
 * Removed activeCategoryFilters from parameters as not used in this application
 *
 * Custom hook that fetches group activities based on filters and search query.
 * - When filters or search query are active, it searches with those parameters
 * - When no filters are active, it fetches all group activities
 */
export const useFetchGroupActivities = ({
  searchQuery,
}: {
  searchQuery: string;
}) => {
  const {
    searchGroupActivitiesPage,
    fetchGroupActivities,
    paginationProps,
    isLoading,
  } = usePaginatedGroupActivities({ customerEnabled: true });

  const hasNoFilter = !searchQuery;

  useEffect(() => {
    if (!hasNoFilter) {
      searchGroupActivitiesPage({
        searchQuery,
      });
    }
  }, [searchGroupActivitiesPage, searchQuery, hasNoFilter]);

  useEffect(() => {
    if (hasNoFilter) {
      fetchGroupActivities();
    }
  }, [fetchGroupActivities, hasNoFilter]);

  return { isLoading, paginationProps };
};
