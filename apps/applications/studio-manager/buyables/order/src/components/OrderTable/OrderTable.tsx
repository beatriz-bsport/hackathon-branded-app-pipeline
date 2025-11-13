import { Decimal } from "decimal.js";
import React from "react";

import {
  Table,
  type TableProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import type { Order } from "@bsport/store-buyables-order";

import { LEGACY_URLS } from "#src/urls";
import {
  ORDER_STATUS_TO_I18N_KEY,
  type OrderStatus,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

import { OrderList } from "./OrderList";
import { useOrderTableColumns } from "./columns";
import type { TableRowData } from "./constants";
import { getMemberInitials, getMemberName } from "./transformers";

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
    memberInitials: getMemberInitials(order),
    memberName: getMemberName(
      order,
      t("table.rows.memberArchived", { ns: "list" }),
    ),
    orderQuantity: (order.product_lines || []).reduce(
      (acc, product) => acc + product.quantity,
      0,
    ),
    orderStatus: order.state as OrderStatus,
    orderTotal: new Decimal(order.total_price).toNumber(),
    link: LEGACY_URLS.ORDER_DETAIL(order.id),
  }));

  // Configure empty state based on the mode
  const emptyConfig = {
    title: t("table.emptyState.title", { ns: "list" }),
    subtitle: t("table.emptyState.emptyDatabase", { ns: "list" }),
  };

  const emptySearchConfig = {
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
  };

  const emptyStateProps = {
    isEmpty,
    emptyConfig,
    isEmptySearch,
    emptySearchConfig,
  };

  const isMobile = !useMatchMedia("lg");

  if (isMobile) {
    return (
      <OrderList
        orderList={orderList}
        paginationProps={paginationProps}
        isEmpty={isEmpty}
        isEmptySearch={isEmptySearch}
        isLoading={isLoading}
        emptyConfig={emptyConfig}
        emptySearchConfig={emptySearchConfig}
      />
    );
  }

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
