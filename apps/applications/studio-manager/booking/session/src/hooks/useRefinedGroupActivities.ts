import { useTranslation } from "#src/utils/i18n";

import { usePaginatedGroupActivities } from "./usePaginatedGroupActivities";

type UseRefinedGroupActivitiesParams = {
  searchQuery: string;
};

export const useRefinedGroupActivities = ({
  searchQuery,
}: UseRefinedGroupActivitiesParams) => {
  const { groupActivities, searchedGroupActivities } =
    usePaginatedGroupActivities({ customerEnabled: true });

  const { t } = useTranslation("sessionCreation");

  const hasNoFilter = !searchQuery;

  const enhanceWithActivityType = (item: (typeof groupActivities)[0]) => ({
    ...item,
    activityType: item.is_workshop
      ? t("addSessionModal.steps.chooseActivity.table.type.workshop")
      : t("addSessionModal.steps.chooseActivity.table.type.groupActivity"),
  });

  return hasNoFilter
    ? groupActivities.map(enhanceWithActivityType)
    : searchedGroupActivities.map(enhanceWithActivityType);
};
