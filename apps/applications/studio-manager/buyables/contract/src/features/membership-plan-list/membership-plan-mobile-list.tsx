import type { FC } from "react";

import { List, type ListProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { MembershipPlanListProps } from "./types";

export const MembershipPlanMobileList: FC<MembershipPlanListProps> = ({
  rows,
  isEmpty,
  emptyConfig,
  paginationProps,
  loadingProps,
}) => {
  const { t } = useTranslation("contract-details");

  const items: ListProps["items"] = rows.map((row) => ({
    id: `membership-plan-${row.id}`,
    title: row.memberName,
    description: row.startDate,
    avatar: {
      shape: "round" as const,
      size: "md" as const,
      initials: row.memberInitials,
      alt: row.memberName,
    },
    chips: [row.statusChip],
    buttons: [
      {
        id: `membership-plan-${row.id}-view`,
        kind: "icon-button" as const,
        icon: "link-external-02" as const,
        color: "main" as const,
        intent: "default" as const,
        size: "md" as const,
        label: t("overview.membershipPlanList.actions.viewBillingPlan"),
        onClick: row.onViewBillingPlan,
      },
    ],
    dropdownConfig: { visibleActionsDisplayLimit: 0 },
  }));

  return (
    <List
      id="membership-plan-mobile-list"
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
