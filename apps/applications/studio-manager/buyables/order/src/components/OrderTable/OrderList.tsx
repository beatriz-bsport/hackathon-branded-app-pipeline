import type { FC } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  List,
  type ListProps,
  type PaginationProps,
} from "@bsport/kaizen-primitive-core";
import type { Order } from "@bsport/store-buyables-order";

import { LEGACY_URLS } from "#src/urls";
import type { OrderStatus } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

import {
  getMemberInitials,
  getMemberName,
  getOrderStatusChipConfig,
} from "./transformers";

export type EmptyConfig = {
  title: string;
  subtitle?: string;
  secondaryButtonConfig?: {
    onClick?: () => void;
  };
};

export type OrderListProps = {
  orderList: Array<Order>;
  paginationProps?: PaginationProps;
  isLoading?: boolean;
  isEmpty?: boolean;
  isEmptySearch?: boolean;
  emptyConfig: EmptyConfig;
  emptySearchConfig: EmptyConfig;
};

export const OrderList: FC<OrderListProps> = ({
  orderList,
  paginationProps,
  isLoading,
  isEmpty,
  isEmptySearch,
  emptyConfig,
  emptySearchConfig,
}) => {
  const { t, i18n } = useTranslation(["list", "common"]);

  const listItems: ListProps["items"] = orderList.map((order) => {
    const memberInitials = getMemberInitials(order);
    const memberName = getMemberName(
      order,
      t("table.rows.memberArchived", { ns: "list" }),
    );
    const orderStatus = order.state as OrderStatus;

    const formattedDate = formatDateTime(
      order.updated_at,
      DATETIME_FORMATS.MEDIUM_DATE,
      { locale: i18n.language },
    );

    const formattedPrice = getCurrencyDisplayWithPrice(
      parseFloat(order.total_price),
    );

    const description = `${formattedDate} - ${formattedPrice}`;

    const { color: statusColor, label: statusLabel } = getOrderStatusChipConfig(
      orderStatus,
      t,
    );

    return {
      id: `order-${order.id}`,
      title: memberName,
      description,
      avatar: {
        initials: memberInitials,
        shape: "round",
        alt: memberName,
        size: "md",
      },
      link: LEGACY_URLS.ORDER_DETAIL(order.id),
      chips: [
        {
          color: statusColor,
          size: "lg" as const,
          type: "weak" as const,
          label: statusLabel,
        },
      ],
      buttons: [],
      dropdownConfig: { visibleActionsDisplayLimit: 0 },
    };
  });

  return (
    <List
      id="order-mobile-list"
      items={listItems}
      paginationProps={paginationProps}
      emptyStateProps={{
        isEmpty: !!isEmpty,
        emptyConfig,
        isEmptySearch: !!isEmptySearch,
        emptySearchConfig,
      }}
      loadingProps={{
        isLoading: isLoading,
        message: t("table.loading", { ns: "list" }),
      }}
      isCompact={false}
    />
  );
};
