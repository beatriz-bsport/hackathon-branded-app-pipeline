import { type FC } from "react";

import { List } from "@bsport/kaizen-primitive-core";
import { ALERT_KINDS } from "@bsport/store-staff-management-alerting";

import { useFetchAlertsByKind } from "#src/api/use-alerts";
import { useTranslation } from "#src/utils/i18n";

import TasksListItem from "./TasksListItem";
import { usePagination } from "./use-pagination";

export const TasksTab: FC = () => {
  const { t } = useTranslation("default");
  const { page, pageSize, onPageChange } = usePagination();

  const {
    alerts: taskAlerts,
    count,
    isLoading,
  } = useFetchAlertsByKind({
    alertKind: ALERT_KINDS.REMINDER_NOTE,
    page,
    pageSize,
  });

  const listItems = taskAlerts.map((alert) => ({
    id: String(alert.data.member.id),
    title: alert.data.name,
    description: alert.data.description,
    memberName: alert.data.member.name,
    dateDue: alert.data.date_due,
  }));

  return (
    <List
      id="tasks-notifications-list"
      items={listItems}
      ListItem={TasksListItem}
      loadingProps={{
        isLoading,
        message: t("notifications.tasks.loading"),
      }}
      paginationProps={{
        currentPage: page,
        rowsPerPage: pageSize,
        totalItems: count,
        onPageChange,
        showRowsPerPageSelector: false,
      }}
      emptyStateProps={{
        isEmpty: !isLoading && taskAlerts.length === 0,
        emptyConfig: {
          title: t("notifications.tasks.empty.title"),
          description: t("notifications.tasks.empty.description"),
        },
      }}
    />
  );
};

export default TasksTab;
