import { type FC } from "react";

import { List } from "@bsport/kaizen-primitive-core";
import { ALERT_KINDS } from "@bsport/store-staff-management-alerting";

import { useFetchAlertsByKind } from "#src/api/use-alerts";
import { useTranslation } from "#src/utils/i18n";

import TutorialsListItem from "./TutorialsListItem";
import { usePagination } from "./use-pagination";

export const TutorialsTab: FC = () => {
  const { t } = useTranslation("default");
  const { page, pageSize, onPageChange } = usePagination();

  const {
    alerts: tutorialAlerts,
    count,
    isLoading,
  } = useFetchAlertsByKind({
    alertKind: ALERT_KINDS.NEW_TUTORIAL_SECTION_OR_LESSON,
    page,
    pageSize,
  });

  const listItems = tutorialAlerts.map((alert) => {
    const { data } = alert;

    return {
      id: String(data.section_id + data.lesson_id),
      sectionNames: data.section_names,
      lessonNames: data.lesson_names,
      isNewSection: data.new_section,
      sectionId: data.section_id,
      lessonId: data.lesson_id,
    };
  });

  return (
    <List
      id="tutorials-notifications-list"
      items={listItems}
      ListItem={TutorialsListItem}
      loadingProps={{
        isLoading,
        message: t("notifications.tutorials.loading"),
      }}
      paginationProps={{
        currentPage: page,
        rowsPerPage: pageSize,
        totalItems: count,
        onPageChange,
        showRowsPerPageSelector: false,
      }}
      emptyStateProps={{
        isEmpty: !isLoading && tutorialAlerts.length === 0,
        emptyConfig: {
          title: t("notifications.tutorials.empty.title"),
          description: t("notifications.tutorials.empty.description"),
        },
      }}
    />
  );
};

export default TutorialsTab;
