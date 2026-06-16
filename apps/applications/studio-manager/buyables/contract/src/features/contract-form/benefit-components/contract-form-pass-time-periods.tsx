import type { FC } from "react";

import { PassFormTimePeriodsSelector } from "@bsport/kaizen-business-components/buyables/pass-form";

import type { ContractFormData } from "../types";

type ContractFormPassTimePeriodsProps = {
  formId: string;
  readonly?: boolean;
};

/**
 * Off-peak time restrictions for a pass. Bound to the form-only
 * `offPeakActive` toggle and the `off_peak_schedule` schedules (converted
 * to/from the backend `Record<string, string[][]>` shape in the form utils).
 */
export const ContractFormPassTimePeriods: FC<
  ContractFormPassTimePeriodsProps
> = ({ formId, readonly }) => {
  return (
    <PassFormTimePeriodsSelector<
      ContractFormData,
      "payment_pack_details.offPeakActive",
      "payment_pack_details.off_peak_schedule"
    >
      formId={formId}
      enableFieldName="payment_pack_details.offPeakActive"
      timePeriodsFieldName="payment_pack_details.off_peak_schedule"
      disabled={readonly}
    />
  );
};
