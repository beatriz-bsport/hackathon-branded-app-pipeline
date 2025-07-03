import { type FC } from "react";

import { List } from "@bsport/kaizen-primitive-core";
import { ALERT_KINDS } from "@bsport/store-staff-management-alerting";

import { useFetchAlertsByKind } from "#src/api/use-alerts";
import { useTranslation } from "#src/utils/i18n";

import UnpaidAppointmentsListItem from "./UnpaidAppointmentsListItem";
import { usePagination } from "./use-pagination";

export const UnpaidAppointmentsTab: FC = () => {
  const { t } = useTranslation("default");
  const { page, pageSize, onPageChange } = usePagination();

  const {
    alerts: unpaidAppointmentsAlerts,
    count,
    isLoading,
  } = useFetchAlertsByKind({
    alertKind: ALERT_KINDS.UNPAID_PRIVATE_BOOKING,
    page,
    pageSize,
  });

  const listItems = unpaidAppointmentsAlerts.map((alert) => {
    return {
      id: String(alert.data.private_booking),
      memberId: alert.data.member_id,
      title: t("notifications.unpaidAppointments.itemTitle"),
      memberName: alert.data.user_name,
      dateStart: alert.data.date_start,
      creditsDue: alert.data.credits_due ?? 0,
    };
  });

  return (
    <List
      id="unpaid-appointments-notifications-list"
      items={listItems}
      ListItem={UnpaidAppointmentsListItem}
      loadingProps={{
        isLoading,
        message: t("notifications.unpaidAppointments.loading"),
      }}
      paginationProps={{
        currentPage: page,
        rowsPerPage: pageSize,
        totalItems: count,
        onPageChange,
        showRowsPerPageSelector: false,
      }}
      emptyStateProps={{
        isEmpty: !isLoading && unpaidAppointmentsAlerts.length === 0,
        emptyConfig: {
          title: t("notifications.unpaidAppointments.empty.title"),
          description: t("notifications.unpaidAppointments.empty.description"),
        },
      }}
    />
  );
};

export default UnpaidAppointmentsTab;
