import { type FC, useState } from "react";

import type { BillingPlan } from "@bsport/api-buyables/billing-plan";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { isPast } from "@bsport/datetime-manipulation";
import {
  getBillingPlanStatus,
  useBillingPlanStatusChipConfigs,
} from "@bsport/kaizen-business-components/buyables/billing-plan-status";
import { List, ListItemProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const PAGINATION_SIZE = 5;

type AffectedBillingPlanListProps = {
  listId: string;
  billingPlans: BillingPlan[];
  isLoading: boolean;
};

export const AffectedBillingPlanList: FC<AffectedBillingPlanListProps> = ({
  listId,
  billingPlans,
  isLoading,
}) => {
  const { t } = useTranslation("contract-features");
  const [currentPage, setCurrentPage] = useState(1); // Frontend pagination - display only

  const chipConfigs = useBillingPlanStatusChipConfigs({ withTooltip: true });

  const getChipStatus = (billingPlan: BillingPlan) => {
    const status = getBillingPlanStatus(billingPlan);
    return {
      ...chipConfigs[status],
      className: "pointer-events-auto",
    } as const;
  };

  const billingPlansPage = billingPlans.slice(
    (currentPage - 1) * PAGINATION_SIZE,
    currentPage * PAGINATION_SIZE,
  );

  const formatBillingPlan = (billingPlan: BillingPlan) => {
    const startDate = formatDateTime(
      billingPlan.first_billing_date,
      DATETIME_FORMATS.SHORT_DATE,
    );

    const startMessage = isPast(billingPlan.first_billing_date)
      ? t("pauseModal.billingPlans.items.description.started", {
          startDate,
        })
      : t("pauseModal.billingPlans.items.description.notStarted", {
          startDate,
        });

    const memberInitials = billingPlan.memberName
      .split(" ")
      .slice(0, 2)
      .reduce((acc, val) => `${acc}${val[0] ?? ""}`, "");

    const billingPlanStatusChip = getChipStatus(billingPlan);

    return {
      id: billingPlan.id.toString(),
      title: billingPlan.memberName,
      description: startMessage,
      avatar: {
        shape: "round",
        initials: memberInitials,
      },
      chips: [billingPlanStatusChip],
      className: "pointer-events-none",
    } satisfies ListItemProps;
  };

  return (
    <List
      id={listId}
      isCompact
      items={billingPlansPage.map(formatBillingPlan)}
      loadingProps={{
        isLoading,
        className: "my-xl",
      }}
      emptyStateProps={{
        isEmpty: !billingPlans.length,
        emptyConfig: {
          subtitle: t("pauseModal.billingPlans.emptyItems"),
        },
      }}
      paginationProps={{
        totalItems: billingPlans.length,
        currentPage,
        rowsPerPage: PAGINATION_SIZE,
        onPageChange: setCurrentPage,
      }}
    />
  );
};
