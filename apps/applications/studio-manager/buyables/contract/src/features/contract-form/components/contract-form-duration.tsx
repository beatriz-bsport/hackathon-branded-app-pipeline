import type { FC } from "react";

import { BILLING_INTERVALS } from "@bsport/api-buyables/contract";
import { FormNumberField } from "@bsport/kaizen-business-components/form/number-field";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { ContractFormData, ContractFormMethods } from "../types";

type ContractFormDurationProps = {
  formId: string;
  readonly?: boolean;
  methods: ContractFormMethods;
};

const RECURRENCE_BASIS_FOR_FIXED_DAYS = 1; // Enforced one month

export const ContractFormDuration: FC<ContractFormDurationProps> = ({
  formId,
  readonly,
  methods,
}) => {
  const { t } = useTranslation("contract-details");

  const hasCustomInterval = methods.watch("hasCustomInterval");
  const recurrenceBasis = methods.watch("recurrence_basis");
  const intervalKind = methods.watch("interval");

  const recurrence = hasCustomInterval
    ? recurrenceBasis
    : RECURRENCE_BASIS_FOR_FIXED_DAYS;

  const intervalTranslations = {
    [BILLING_INTERVALS.DAY]: t("intervals.day", { count: recurrence }),
    [BILLING_INTERVALS.WEEK]: t("intervals.week", { count: recurrence }),
    [BILLING_INTERVALS.MONTH]: t("intervals.month", { count: recurrence }),
    [BILLING_INTERVALS.YEAR]: t("intervals.year", { count: recurrence }),
  };

  const trueInterval = hasCustomInterval
    ? intervalKind
    : BILLING_INTERVALS.MONTH;
  const finalUnit = `${recurrence} ${intervalTranslations[trueInterval]}`;

  return (
    <FormNumberField<ContractFormData, "nb_interval">
      fieldName="nb_interval"
      id={`${formId}-duration`}
      label={t("formFields.duration.label")}
      required
      disabled={readonly}
      suffix={{ type: "text", value: finalUnit, className: "text-nowrap" }}
      statusText={
        hasCustomInterval ? undefined : t("formFields.duration.helperText")
      }
      min={
        hasCustomInterval
          ? FIELD_CONSTRAINTS.NB_CUSTOM_INTERVAL_MIN
          : FIELD_CONSTRAINTS.NB_FIXED_INTERVAL_MIN
      }
      max={
        hasCustomInterval ? undefined : FIELD_CONSTRAINTS.NB_FIXED_INTERVAL_MAX
      }
      step={1}
      maxDigits={0}
    />
  );
};
