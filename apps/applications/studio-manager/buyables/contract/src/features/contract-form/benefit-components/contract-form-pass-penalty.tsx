import type { FC } from "react";

import { PassFormPenaltySelector } from "@bsport/kaizen-business-components/buyables/pass-form";

import type { ContractFormData } from "../types";

type ContractFormPassPenaltyProps = {
  formId: string;
  readonly: boolean;
};

// Anchor to the personalisation settings where no-show penalties are configured.
const NO_SHOW_SETTINGS_HREF = "/settings/personalization/general";

/**
 * Late-cancellation & no-show penalties for an unlimited pass. Bound to the
 * `payment_pack_details.*` penalty fields, with `applyPenalties` as the
 * form-only master toggle.
 */
export const ContractFormPassPenalty: FC<ContractFormPassPenaltyProps> = ({
  formId,
  readonly,
}) => {
  return (
    <PassFormPenaltySelector<
      ContractFormData,
      "payment_pack_details.applyPenalties",
      | "payment_pack_details.penalty_active"
      | "payment_pack_details.no_show_penalty_active",
      | "payment_pack_details.penalty_nb_late_cancellations"
      | "payment_pack_details.penalty_nb_days"
      | "payment_pack_details.penalty_kind"
      | "payment_pack_details.penalty_days_blocked"
      | "payment_pack_details.penalty_account_value"
      | "payment_pack_details.no_show_penalty_threshold"
      | "payment_pack_details.no_show_penalty_time_window_days"
      | "payment_pack_details.no_show_penalty_kind"
      | "payment_pack_details.no_show_penalty_days_blocked"
      | "payment_pack_details.no_show_penalty_amount"
    >
      formId={formId}
      applyPenaltyFieldName="payment_pack_details.applyPenalties"
      lateCancellationActiveFieldName="payment_pack_details.penalty_active"
      lateCancellationThresholdFieldName="payment_pack_details.penalty_nb_late_cancellations"
      lateCancellationWindowDaysFieldName="payment_pack_details.penalty_nb_days"
      lateCancellationKindFieldName="payment_pack_details.penalty_kind"
      lateCancellationBlockedDaysFieldName="payment_pack_details.penalty_days_blocked"
      lateCancellationChargedAmountFieldName="payment_pack_details.penalty_account_value"
      noShowActiveFieldName="payment_pack_details.no_show_penalty_active"
      noShowThresholdFieldName="payment_pack_details.no_show_penalty_threshold"
      noShowTimeWindowDaysFieldName="payment_pack_details.no_show_penalty_time_window_days"
      noShowKindFieldName="payment_pack_details.no_show_penalty_kind"
      noShowBlockedDaysFieldName="payment_pack_details.no_show_penalty_days_blocked"
      noShowChargedAmountFieldName="payment_pack_details.no_show_penalty_amount"
      noShowSettingsHref={NO_SHOW_SETTINGS_HREF}
      disabled={readonly}
    />
  );
};
