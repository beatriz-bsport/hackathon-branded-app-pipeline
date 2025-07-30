import { type FC } from "react";

import { List } from "@bsport/kaizen-primitive-core";

import { useFetchAlertsByKind } from "#src/api/use-alerts";

import type { GenericNotificationTabProps } from "./types";
import { usePagination } from "./use-pagination";

export const GenericNotificationTab: FC<GenericNotificationTabProps> = ({
  config,
}) => {
  const { page, pageSize, onPageChange } = usePagination();

  const { alerts, count, isLoading } = useFetchAlertsByKind({
    alertKind: config.alertKind,
    page,
    pageSize,
  });

  const listItems = alerts.map((alert, index) =>
    config.transformData(alert, index),
  );

  return (
    <List
      id={`${config.id}-notifications-list`}
      items={listItems}
      ListItem={config.ListItemComponent}
      loadingProps={{
        isLoading,
        message: config.translations.loading,
      }}
      paginationProps={{
        currentPage: page,
        rowsPerPage: pageSize,
        totalItems: count,
        onPageChange,
        showRowsPerPageSelector: false,
      }}
      emptyStateProps={{
        isEmpty: !isLoading && alerts.length === 0,
        emptyConfig: {
          title: config.translations.emptyTitle,
          description: config.translations.emptyDescription,
          className:
            "flex items-center justify-center min-h-[400px] min-w-[400px]",
        },
      }}
    />
  );
};
