import type { FC } from "react";

import { getCurrencyCode } from "@bsport/currency";
import { FormNumberField } from "@bsport/kaizen-business-components/form/number-field";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { ContractFormData } from "../types";

type ContractFormRecurringAmountProps = {
  formId: string;
  readonly: boolean;
};

export const ContractFormRecurringAmount: FC<
  ContractFormRecurringAmountProps
> = ({ formId, readonly }) => {
  const { t } = useTranslation("contract-details");

  return (
    <FormNumberField<ContractFormData, "recurrent_price">
      fieldName="recurrent_price"
      id={`${formId}-recurring-amount`}
      label={t("formFields.recurringAmount.label")}
      required
      disabled={readonly}
      helperText={t("formFields.recurringAmount.helperText")}
      suffix={{ type: "text", value: getCurrencyCode().toLocaleUpperCase() }}
      min={FIELD_CONSTRAINTS.PRICE_MIN}
    />
  );
};
