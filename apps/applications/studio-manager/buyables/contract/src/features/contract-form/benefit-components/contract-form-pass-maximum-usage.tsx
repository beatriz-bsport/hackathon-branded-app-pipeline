import type { FC } from "react";

import { PassFormMaximumUsage } from "@bsport/kaizen-business-components/buyables/pass-form";

import type { ContractFormData } from "../types";

type ContractFormPassMaximumUsageProps = {
  formId: string;
  readonly?: boolean;
};

/**
 * Per-day/week/month booking caps and per-member purchase cap for a pass,
 * gated by the form-only `hasMaximumUsage` toggle.
 */
export const ContractFormPassMaximumUsage: FC<
  ContractFormPassMaximumUsageProps
> = ({ formId, readonly }) => {
  return (
    <PassFormMaximumUsage<
      ContractFormData,
      "payment_pack_details.hasMaximumUsage",
      | "payment_pack_details.max_bookings_per_day"
      | "payment_pack_details.max_bookings_per_week"
      | "payment_pack_details.max_bookings_per_month"
    >
      formId={formId}
      hasMaximumUsageFieldName="payment_pack_details.hasMaximumUsage"
      maximumPerDayFieldName="payment_pack_details.max_bookings_per_day"
      maximumPerWeekFieldName="payment_pack_details.max_bookings_per_week"
      maximumPerMonthFieldName="payment_pack_details.max_bookings_per_month"
      maximumPerMemberFieldName={null}
      disabled={readonly}
    />
  );
};
