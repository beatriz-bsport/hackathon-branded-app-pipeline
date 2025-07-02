import { type FC, useState } from "react";

import { List } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import {
  ALERT_KINDS,
  type InvoiceAlert,
} from "@bsport/store-staff-management-alerting";

import { useFetchAlertsByKind } from "#src/api/use-alerts";
import { useTranslation } from "#src/utils/i18n";

import BillingListItem from "./BillingListItem";

const PAGE_SIZE = 6;

export const BillingTab: FC = () => {
  const { t, i18n } = useTranslation("default");
  const [currentPage, setCurrentPage] = useState(1);

  const { alerts, count, isLoading } = useFetchAlertsByKind({
    alertKind: ALERT_KINDS.UNEVEN_INVOICE,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const companyTheme = dataAccessLayer.useCompanyTheme();
  // TODO: improve inference in the alerting store
  const billingAlerts = alerts as InvoiceAlert[];

  const listItems = billingAlerts.map((alert) => ({
    id: alert.data.uuid,
    title: "Unpaid invoice",
    description: "Invoice has not been finalized yet",
    paidAmount: alert.data.price_payed,
    dueAmount: alert.data.price_due,
    currency: companyTheme?.currency || "EUR",
    language: i18n.language,
  }));

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onPageSettingsChange = (page: number) => {
    setCurrentPage(page);
  };

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
        currentPage,
        rowsPerPage: PAGE_SIZE,
        totalItems: count,
        onPageChange,
        onPageSettingsChange,
        showRowsPerPageSelector: false,
      }}
      emptyStateProps={{
        isEmpty: !isLoading && alerts.length === 0,
        emptyConfig: {
          title: t("notifications.billing.empty.title"),
          description: t("notifications.billing.empty.description"),
        },
      }}
    />
  );
};
