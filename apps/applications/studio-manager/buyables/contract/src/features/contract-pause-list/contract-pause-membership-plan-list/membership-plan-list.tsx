import type { FC } from "react";

import type { BillingPlan } from "@bsport/api-buyables/billing-plan";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { isPast } from "@bsport/datetime-manipulation";
import {
  getBillingPlanStatus,
  useBillingPlanStatusChipConfigs,
} from "@bsport/kaizen-business-components/buyables/billing-plan-status";
import { List, type ListItemProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const PAGINATION_SIZE = 8;

type MembershipPlanListProps = {
  totalItems: number;
  contractId: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  membershipPlansPage: BillingPlan[];
};

/**
 * UI for listing MembershipPlans - Rendering logic only
 */
export const MembershipPlanList: FC<MembershipPlanListProps> = ({
  totalItems,
  contractId,
  currentPage,
  onPageChange,
  membershipPlansPage,
}) => {
  const { t } = useTranslation("contract-features");

  const chipConfigs = useBillingPlanStatusChipConfigs({ withTooltip: true });

  const getChipStatus = (membershipPlan: BillingPlan) => {
    const status = getBillingPlanStatus(membershipPlan);
    return {
      ...chipConfigs[status],
      className: "pointer-events-auto",
    } as const;
  };

  const formatBillingPlan = (membershipPlan: BillingPlan) => {
    const startDate = formatDateTime(
      membershipPlan.first_billing_date,
      DATETIME_FORMATS.SHORT_DATE,
    );
    const hasStarted = isPast(membershipPlan.first_billing_date);

    const memberInitials = membershipPlan.memberName
      .split(" ")
      .slice(0, 2)
      .reduce((acc, val) => `${acc}${val[0] ?? ""}`, "");

    const membershipPlanStatusChip = getChipStatus(membershipPlan);

    return {
      id: membershipPlan.id.toString(),
      title: membershipPlan.memberName,
      description: hasStarted
        ? t("pauseModal.billingPlans.items.description.started", {
            startDate,
          })
        : t("pauseModal.billingPlans.items.description.notStarted", {
            startDate,
          }),
      avatar: {
        shape: "round",
        initials: memberInitials,
      },
      chips: [membershipPlanStatusChip],
      className: "pointer-events-none",
    } satisfies ListItemProps;
  };

  return (
    <List
      id={`contract-${contractId}-pause-membership-plans`}
      isCompact
      items={membershipPlansPage.map(formatBillingPlan)}
      emptyStateProps={{
        isEmpty: totalItems === 0,
        emptyConfig: {
          subtitle: t("pauseDetailDrawer.emptyList"),
        },
      }}
      paginationProps={{
        totalItems,
        currentPage,
        rowsPerPage: PAGINATION_SIZE,
        onPageChange,
      }}
    />
  );
};
