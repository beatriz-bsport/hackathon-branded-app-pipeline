import { FC } from "react";

import { List, type ListItemProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { UpcomingActivityFillRate } from "./fill-rate.component";
import { useUpcomingActivitiesRows } from "./rows";

type UpcomingActivitiesListProps = {
  isLoading: boolean;
};

export const UpcomingActivitiesList: FC<UpcomingActivitiesListProps> = ({
  isLoading,
}) => {
  const { t } = useTranslation("default");

  const rows = useUpcomingActivitiesRows();

  const items = rows.map(
    ({
      teacherSubstituteRequired,
      activityDate,
      id,
      activityName,
      teacherName,
      teacherSubstituteName,
      emptySpotsCount,
      fillRate,
      hasWaitingList,
      waitingListCount,
      link,
    }) => {
      const teacherRequest = teacherSubstituteRequired
        ? t("upcomingClassesPanel.substitution.errorMissingReplacement")
        : "";

      return {
        id: id.toString(),
        title: activityName,
        description: [
          activityDate,
          teacherName || teacherSubstituteName || teacherRequest,
        ].join(" - "),
        customNode: (
          <UpcomingActivityFillRate
            emptySpotsCount={emptySpotsCount}
            fillRate={fillRate}
            hasWaitingList={hasWaitingList}
            waitingListCount={waitingListCount}
            tooltipPlacement="top-right"
          />
        ),
        link,
      } satisfies ListItemProps;
    },
  );

  return (
    <List
      id="upcoming-classes-list"
      items={items}
      emptyStateProps={{
        isEmpty: items.length === 0,
        emptyConfig: {
          title: t("upcomingClassesPanel.emptyList"),
        },
      }}
      loadingProps={{
        isLoading,
        className: "h-[var(--card-min-height)]",
      }}
    />
  );
};
