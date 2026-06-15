import type { FC } from "react";

import { List, type ListProps } from "@bsport/kaizen-primitive-core";

import type { MembershipPlanInvoiceListProps } from "./types";

export const MembershipPlanInvoiceMobile: FC<
  MembershipPlanInvoiceListProps
> = ({ rows, isEmpty, emptyConfig, paginationProps, loadingProps }) => {
  const items: ListProps["items"] = rows.map((row) => ({
    id: `membership-plan-invoice-${row.id}`,
    title: row.billingDate,
    description: row.amount,
    chips: [row.statusChip],
    buttons: [],
    dropdownConfig: { visibleActionsDisplayLimit: 0 },
  }));

  return (
    <List
      id="membership-plan-invoice-mobile"
      items={items}
      paginationProps={paginationProps}
      emptyStateProps={{
        isEmpty,
        emptyConfig,
      }}
      loadingProps={loadingProps}
      isCompact={false}
    />
  );
};
