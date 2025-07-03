import { type FC } from "react";

import { List } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { ALERT_KINDS } from "@bsport/store-staff-management-alerting";

import { useFetchAlertsByKind } from "#src/api/use-alerts";
import { useTranslation } from "#src/utils/i18n";

import OrdersListItem from "./OrdersListItem";
import { DEFAULT_CURRENCY_DISPLAY } from "./constants";
import { usePagination } from "./use-pagination";

export const OrdersTab: FC = () => {
  const { t } = useTranslation("default");
  const { page, pageSize, onPageChange } = usePagination();

  const {
    alerts: orderAlerts,
    count,
    isLoading,
  } = useFetchAlertsByKind({
    alertKind: ALERT_KINDS.NEW_ORDER,
    page,
    pageSize,
  });

  const companyTheme = dataAccessLayer.useCompanyTheme();

  const listItems = orderAlerts.map((alert) => ({
    id: String(alert.data.order),
    title: t("notifications.orders.itemTitle"),
    price: alert.data.price,
    name: alert.data.name,
    currencySymbol: companyTheme?.currency_display || DEFAULT_CURRENCY_DISPLAY,
  }));

  return (
    <List
      id="orders-notifications-list"
      items={listItems}
      ListItem={OrdersListItem}
      loadingProps={{
        isLoading,
        message: t("notifications.orders.loading"),
      }}
      paginationProps={{
        currentPage: page,
        rowsPerPage: pageSize,
        totalItems: count,
        onPageChange,
        showRowsPerPageSelector: false,
      }}
      emptyStateProps={{
        isEmpty: !isLoading && orderAlerts.length === 0,
        emptyConfig: {
          title: t("notifications.orders.empty.title"),
          description: t("notifications.orders.empty.description"),
        },
      }}
    />
  );
};

export default OrdersTab;
