import type { FC } from "react";

import {
  type ActionButton,
  type ActionsDropdownConfig,
  List,
  type ListProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { MembershipPlanInvoiceListProps } from "./types";

export const MembershipPlanInvoiceMobile: FC<
  MembershipPlanInvoiceListProps
> = ({
  rows,
  isEmpty,
  emptyConfig,
  paginationProps,
  loadingProps,
  onEditBillingDate,
}) => {
  const { t } = useTranslation("membership-plan");

  const items: ListProps["items"] = rows.map((row) => {
    const buttons: ActionButton[] = [
      {
        id: `edit-billing-date-${row.id}`,
        kind: "icon-button",
        intent: "flat",
        icon: "calendar",
        color: "default",
        label: t("invoiceList.actions.editBillingDate"),
        size: "md",
        disabled: row.isPast,
        onClick: () => onEditBillingDate(row),
      },
    ];

    const dropdownConfig: ActionsDropdownConfig = {
      visibleActionsDisplayLimit: 0,
      dropdownTargetProps: {
        kind: "icon-button",
        intent: "flat",
        icon: "pencil-02",
        color: "default",
        label: t("invoiceList.actions.openActions"),
        size: "md",
      },
    };

    return {
      id: `membership-plan-invoice-${row.id}`,
      title: row.billingDate,
      description: row.amount,
      chips: [row.statusChip],
      buttons,
      dropdownConfig,
    };
  });

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
