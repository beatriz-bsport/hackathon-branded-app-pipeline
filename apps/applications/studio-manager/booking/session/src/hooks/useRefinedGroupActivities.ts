import type { MetaActivity } from "@bsport/api-book";

import {
  setSelectedGroupActivity,
  setStepValid,
} from "#src/stores/session-creation/actions";
import { selectSelectedGroupActivity } from "#src/stores/session-creation/selectors";
import {
  SESSION_CREATION_STEPS,
  useSessionCreationStore,
} from "#src/stores/session-creation/store";
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
  const selectedGroupActivity = useSessionCreationStore(
    selectSelectedGroupActivity,
  );

  const hasNoFilter = !searchQuery;

  const handleRowClick = (activity: MetaActivity) => {
    setSelectedGroupActivity(activity);
    setStepValid(SESSION_CREATION_STEPS.CHOOSE_GROUP_ACTIVITY, !!activity);
  };

  const getIsRowActive = (activity: MetaActivity) => {
    return selectedGroupActivity?.id === activity.id;
  };

  const enhanceWithActivityType = (item: (typeof groupActivities)[0]) => ({
    ...item,
    activityType: item.is_workshop
      ? t("addSessionModal.steps.chooseActivity.table.type.workshop")
      : t("addSessionModal.steps.chooseActivity.table.type.groupActivity"),
    onRowClick: () => {
      handleRowClick(item);
    },
    isActive: getIsRowActive(item),
  });

  return hasNoFilter
    ? groupActivities.map(enhanceWithActivityType)
    : searchedGroupActivities.map(enhanceWithActivityType);
};
