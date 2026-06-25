import { useCallback } from "react";

import type { MetaActivity } from "@bsport/api-book";

import { ServiceSelectionStep } from "#src/components/service-selection/service-selection-step";
import { sessionCreationActivitySelectedEvent } from "#src/events/session-creation/events";
import {
  setSelectedGroupActivity,
  setStepValid,
} from "#src/stores/session-creation/actions";
import { selectSelectedGroupActivity } from "#src/stores/session-creation/selectors";
import {
  SESSION_CREATION_STEPS,
  useSessionCreationStore,
} from "#src/stores/session-creation/store";
import { analyticsTrackSafeEvent } from "#src/utils/analytics-track-safe-event";
import { useTranslation } from "#src/utils/i18n";

export const ChooseActivityStep = () => {
  const { t } = useTranslation("sessionCreation");
  const selectedGroupActivity = useSessionCreationStore(
    selectSelectedGroupActivity,
  );

  const handleSelectActivity = useCallback(
    (activity: MetaActivity, { searchQuery }: { searchQuery: string }) => {
      analyticsTrackSafeEvent(sessionCreationActivitySelectedEvent, {
        activity_id: activity.id,
        activity_name: activity.name,
        activity_type: activity.is_workshop ? "workshop" : "group-activity",
        search_value: searchQuery || null,
      });
      setSelectedGroupActivity(activity);
      setStepValid(SESSION_CREATION_STEPS.CHOOSE_GROUP_ACTIVITY, !!activity);
    },
    [],
  );

  const getActivityDisplayName = useCallback(
    (activity: MetaActivity) =>
      activity.name.charAt(0).toUpperCase() + activity.name.slice(1),
    [],
  );

  const getActivityTypeLabel = useCallback(
    (activity: MetaActivity) =>
      activity.is_workshop
        ? t("addSessionModal.steps.chooseActivity.table.type.workshop")
        : t("addSessionModal.steps.chooseActivity.table.type.groupActivity"),
    [t],
  );

  return (
    <ServiceSelectionStep
      selectedServiceId={selectedGroupActivity?.id}
      onSelectService={handleSelectActivity}
      getServiceDisplayName={getActivityDisplayName}
      getServiceTypeLabel={getActivityTypeLabel}
      labels={{
        description: t("addSessionModal.steps.chooseActivity.description"),
        searchPlaceholder: t(
          "addSessionModal.steps.chooseActivity.search.placeholder",
        ),
        loading: t("addSessionModal.steps.chooseActivity.loadingActivities"),
        emptyTitle: t(
          "addSessionModal.steps.chooseActivity.table.emptyState.title",
        ),
        serviceColumn: t(
          "addSessionModal.steps.chooseActivity.table.columns.activity",
        ),
        serviceTypeColumn: t(
          "addSessionModal.steps.chooseActivity.table.columns.type",
        ),
        livestreamTooltip: t(
          "addSessionModal.steps.chooseActivity.table.features.livestream.popoverLabel",
        ),
      }}
    />
  );
};
