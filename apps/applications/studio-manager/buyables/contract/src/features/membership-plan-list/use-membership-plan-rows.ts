import { useNavigate } from "react-router";

import type { BillingPlan } from "@bsport/api-buyables/billing-plan";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  BILLING_PLAN_FINAL_STATUS,
  getBillingPlanStatus,
  useBillingPlanStatusChipConfigs,
} from "@bsport/kaizen-business-components/buyables/billing-plan-status";
import { ChipProps, WithTooltip } from "@bsport/kaizen-primitive-core";

import { URLS, getHrefFromRoot } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import type { MembershipPlanRowData } from "./types";

const getMemberInitials = (memberName: string) =>
  memberName
    .split(" ")
    .slice(0, 2)
    .reduce((acc, part) => `${acc}${part[0] ?? ""}`, "");

/**
 * Transforms billing plans into the row shape shared by the table and the list.
 */
export const useMembershipPlanRows = (
  billingPlans: BillingPlan[],
): MembershipPlanRowData[] => {
  const { t } = useTranslation("contract-details");
  const baseConfigs = useBillingPlanStatusChipConfigs({ withLabel: true });
  const navigate = useNavigate();

  const getStatusChip = (billingPlan: BillingPlan): WithTooltip<ChipProps> => {
    const status = getBillingPlanStatus(billingPlan);

    let tooltip = "";
    switch (status) {
      case BILLING_PLAN_FINAL_STATUS.CANCELED:
        tooltip = t("overview.membershipPlanList.statusTooltips.canceled");
        break;
      case BILLING_PLAN_FINAL_STATUS.ENDED:
        tooltip = t("overview.membershipPlanList.statusTooltips.ended");
        break;
      case BILLING_PLAN_FINAL_STATUS.PAUSED:
        tooltip = t("overview.membershipPlanList.statusTooltips.paused");
        break;
      case BILLING_PLAN_FINAL_STATUS.VALID:
        tooltip = t("overview.membershipPlanList.statusTooltips.valid");
        break;
      default:
        break;
    }

    return {
      ...baseConfigs[status],
      tooltipProps: { label: tooltip },
    };
  };

  return billingPlans.map((billingPlan) => ({
    id: billingPlan.id,
    memberName: billingPlan.memberName,
    memberInitials: getMemberInitials(billingPlan.memberName),
    startDate: formatDateTime(
      billingPlan.started_at ?? billingPlan.first_billing_date,
      DATETIME_FORMATS.MEDIUM_DATE,
    ),
    statusChip: getStatusChip(billingPlan),
    onViewBillingPlan: () => {
      navigate(
        getHrefFromRoot(
          URLS.MEMBERSHIP_PLAN(billingPlan.contract, billingPlan.id),
        ),
      );
    },
  }));
};
