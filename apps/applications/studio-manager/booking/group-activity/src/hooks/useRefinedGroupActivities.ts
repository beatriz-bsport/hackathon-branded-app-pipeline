import type { ActiveCategoryFilters } from "./useCategoryFilter";
import { usePaginatedGroupActivities } from "./usePaginatedGroupActivities";

type UseRefinedGroupActivitiesParams = {
  searchQuery: string;
  activeCategoryFilters: ActiveCategoryFilters;
};

export const useRefinedGroupActivities = ({
  searchQuery,
  activeCategoryFilters,
}: UseRefinedGroupActivitiesParams) => {
  const { groupActivities, searchedGroupActivities } =
    usePaginatedGroupActivities({ customerEnabled: true });

  const hasNoFilter =
    !searchQuery &&
    !activeCategoryFilters.is.length &&
    !activeCategoryFilters.isNot.length;

  const getGroupActivityDetailLink = (groupActivityId: string) =>
    `/activity/${groupActivityId}/general`;

  const enhancedGroupActivities = groupActivities.map((item) => ({
    ...item,
    link: getGroupActivityDetailLink(item.id.toString()),
    color: item.color,
  }));

  const enhancedSearchedGroupActivities = searchedGroupActivities.map(
    (item) => ({
      ...item,
      link: getGroupActivityDetailLink(item.id.toString()),
      color: item.color,
    }),
  );

  return hasNoFilter
    ? enhancedGroupActivities
    : enhancedSearchedGroupActivities;
};
