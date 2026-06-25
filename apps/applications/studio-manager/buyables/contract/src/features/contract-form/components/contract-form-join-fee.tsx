import type { FC } from "react";

import { getCurrencyCode } from "@bsport/currency";
import { FormNumberField } from "@bsport/kaizen-business-components/form/number-field";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { ContractFormData } from "../types";

type ContractFormJoinFeeProps = {
  formId: string;
  readonly: boolean;
};

export const ContractFormJoinFee: FC<ContractFormJoinFeeProps> = ({
  formId,
  readonly,
}) => {
  const { t } = useTranslation("contract-details");

  return (
    <FormNumberField<ContractFormData, "flat_fee">
      fieldName="flat_fee"
      id={`${formId}-join-fee`}
      label={t("formFields.joinFee.label")}
      required
      disabled={readonly}
      helperText={t("formFields.joinFee.helperText")}
      suffix={{ type: "text", value: getCurrencyCode().toLocaleUpperCase() }}
      min={FIELD_CONSTRAINTS.PRICE_MIN}
    />
  );
};
