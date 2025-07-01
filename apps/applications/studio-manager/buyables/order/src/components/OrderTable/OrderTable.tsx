import { Decimal } from "decimal.js";
import React from "react";

import { Table, type TableProps } from "@bsport/kaizen-primitive-core";
import type { Order } from "@bsport/store-buyables-order";

import { LEGACY_URLS } from "#src/urls";
import {
  ORDER_STATUS_TO_I18N_KEY,
  type OrderStatus,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

import { useOrderTableColumns } from "./columns";
import type { TableRowData } from "./constants";

type OrderTableProps = {
  orderList: Array<Order>;
  paginationProps: TableProps<TableRowData>["paginationProps"];
  isLoading?: boolean;
  isEmpty?: boolean;
  isEmptySearch?: boolean;
  filterStatus?: OrderStatus | undefined;
  handleClearFilters: () => void;
};

export const OrderTable: React.FC<OrderTableProps> = ({
  orderList = [],
  paginationProps,
  isLoading = false,
  isEmpty = false,
  isEmptySearch = false,
  filterStatus,
  handleClearFilters,
}) => {
  const { t } = useTranslation(["list", "common"]);

  const tableColumns = useOrderTableColumns();

  // Format orders to match table data
  const tableRows: Array<TableRowData> = orderList.map((order) => ({
    id: order.id,
    dateCreated: new Date(order.created_at),
    dateUpdated: new Date(order.updated_at),
    memberPhotoSrc: undefined, // Missing in the serializer
    memberInitials:
      `${order.first_name?.[0] ?? ""}${order.last_name?.[0] ?? ""}`.toUpperCase(),
    memberName: [
      order?.first_name,
      order?.last_name,
      order.member_archived
        ? `(${t("table.rows.memberArchived", { ns: "list" })})`
        : undefined,
    ]
      .filter((name) => !!name)
      .join(" "),
    orderQuantity: (order.product_lines || []).reduce(
      (acc, product) => acc + product.quantity,
      0,
    ),
    orderStatus: order.state as OrderStatus,
    orderTotal: new Decimal(order.total_price).toNumber(),
    link: LEGACY_URLS.ORDER_DETAIL(order.id),
  }));

  // Configure empty state based on the mode
  const emptyStateProps = {
    isEmpty,
    emptyConfig: {
      title: t("table.emptyState.title", { ns: "list" }),
      subtitle: t("table.emptyState.emptyDatabase", { ns: "list" }),
    },
    isEmptySearch,
    emptySearchConfig: {
      title: t("table.emptyState.title", { ns: "list" }),
      subtitle: t("table.emptyState.emptySearch", {
        ns: "list",
        status: filterStatus
          ? t(`status.values.${ORDER_STATUS_TO_I18N_KEY[filterStatus]}`, {
              ns: "common",
            })
          : "",
      }),
      secondaryButtonConfig: {
        onClick: handleClearFilters,
      },
    },
  };

  return (
    <Table
      columns={tableColumns}
      rowHeight="lg"
      rows={tableRows}
      paginationProps={paginationProps}
      emptyStateProps={emptyStateProps}
      loadingProps={{
        isLoading,
        message: t("table.loading", { ns: "list" }),
      }}
    />
  );
};
