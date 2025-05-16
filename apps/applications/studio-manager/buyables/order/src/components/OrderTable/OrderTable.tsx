import { clsx } from "clsx";
import React from "react";

import {
  Body,
  Loader,
  Table,
  type TableProps,
} from "@bsport/kaizen-primitive-core";

import {
  ORDER_STATUS_TO_I18N_KEY,
  type OrderStatus,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

import { useOrderTableColumns } from "./columns";
import type { Order, TableRowData } from "./constants";

type OrderTableProps = {
  orderList: Array<Order>;
  paginationProps: TableProps<TableRowData>["paginationProps"];
  isLoading?: boolean;
  isEmpty?: boolean;
  isEmptySearch?: boolean;
  filterStatus?: OrderStatus | undefined;
};

export const OrderTable: React.FC<OrderTableProps> = ({
  orderList = [],
  paginationProps,
  isLoading = false,
  isEmpty = false,
  isEmptySearch = false,
  filterStatus,
}) => {
  const { t } = useTranslation(["list", "common"]);

  const tableColumns = useOrderTableColumns();

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-md">
        <Loader size="xl" />
        <Body htmlVariant="p">{t("table.loading", { ns: "list" })}</Body>
      </div>
    );
  }

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
    orderStatus: order.state,
    orderTotal: order.total_price,
  }));

  // Configure empty state based on the mode
  const emptyStateProps = {
    isEmpty,
    emptyConfig: {
      className: "max-w-[320px]",
      title: t("table.emptyState.title", { ns: "list" }),
      subtitle: t("table.emptyState.emptyDatabase", { ns: "list" }),
    },
    isEmptySearch,
    emptySearchConfig: {
      className: "max-w-[320px]",
      title: t("table.emptyState.title", { ns: "list" }),
      subtitle: t("table.emptyState.emptySearch", {
        ns: "list",
        status: filterStatus
          ? t(`status.values.${ORDER_STATUS_TO_I18N_KEY[filterStatus]}`, {
              ns: "common",
            })
          : "",
      }),
    },
  };

  return (
    <div
      className={clsx("w-full h-full flex flex-col flex-1", {
        "items-center justify-center": isEmpty || isEmptySearch,
      })}
    >
      <Table
        columns={tableColumns}
        rowHeight="lg"
        rows={tableRows}
        paginationProps={paginationProps}
        emptyStateProps={emptyStateProps}
      />
    </div>
  );
};
