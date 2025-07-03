import { type FC } from "react";

import { List } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { ALERT_KINDS } from "@bsport/store-staff-management-alerting";

import { useFetchAlertsByKind } from "#src/api/use-alerts";
import { useTranslation } from "#src/utils/i18n";

import BillingListItem from "./BillingListItem";
import { DEFAULT_CURRENCY_DISPLAY } from "./constants";
import { usePagination } from "./use-pagination";

export const BillingTab: FC = () => {
  const { t } = useTranslation("default");
  const { page, pageSize, onPageChange } = usePagination();

  const {
    alerts: billingAlerts,
    count,
    isLoading,
  } = useFetchAlertsByKind({
    alertKind: ALERT_KINDS.UNEVEN_INVOICE,
    page,
    pageSize,
  });

  const companyTheme = dataAccessLayer.useCompanyTheme();

  const listItems = billingAlerts.map((alert) => ({
    id: alert.data.uuid,
    title: t("notifications.billing.itemTitle"),
    description: t("notifications.billing.itemDescription"),
    paidAmount: alert.data.price_payed,
    dueAmount: alert.data.price_due,
    currencySymbol: companyTheme?.currency_display || DEFAULT_CURRENCY_DISPLAY,
  }));

  return (
    <List
      id="billing-notifications-list"
      items={listItems}
      ListItem={BillingListItem}
      loadingProps={{
        isLoading,
        message: t("notifications.billing.loading"),
      }}
      paginationProps={{
        currentPage: page,
        rowsPerPage: pageSize,
        totalItems: count,
        onPageChange,
        showRowsPerPageSelector: false,
      }}
      emptyStateProps={{
        isEmpty: !isLoading && billingAlerts.length === 0,
        emptyConfig: {
          title: t("notifications.billing.empty.title"),
          description: t("notifications.billing.empty.description"),
        },
      }}
    />
  );
};
