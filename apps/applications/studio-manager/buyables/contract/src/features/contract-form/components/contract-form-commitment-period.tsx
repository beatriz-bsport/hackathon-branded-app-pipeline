import type { FC } from "react";

import { FormNumberField } from "@bsport/kaizen-business-components/form/number-field";
import { FormToggle } from "@bsport/kaizen-business-components/form/toggle";
import { Alert } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { ContractFormData, ContractFormMethods } from "../types";
import { ContractFormIntervalSelector } from "./contract-form-interval-selector";

type ContractFormCommitmentPeriodProps = {
  formId: string;
  methods: ContractFormMethods;
  readonly: boolean;
};

export const ContractFormCommitmentPeriod: FC<
  ContractFormCommitmentPeriodProps
> = ({ formId, methods, readonly }) => {
  const { t } = useTranslation("contract-details");

  const hasCommitmentPeriod = methods.watch("has_mandatory_commitment_period");
  const commitmentPeriodValue = methods.watch("commitment_period_value");

  const baseId = `${formId}-commitment-period`;
  return (
    <>
      <FormToggle<ContractFormData, "has_mandatory_commitment_period">
        fieldName="has_mandatory_commitment_period"
        id={`${baseId}-toggle`}
        label={t("formFields.commitmentPeriod.label")}
        disabled={readonly}
      />

      {hasCommitmentPeriod && (
        <div className="ml-[40px]">
          <div className="flex flex-row gap-2xs items-start">
            <FormNumberField<ContractFormData, "commitment_period_value">
              fieldName="commitment_period_value"
              id={`${baseId}-value`}
              required
              label={t("formFields.commitmentPeriod.sublabel")}
              min={FIELD_CONSTRAINTS.COMMITMENT_VALUE_MIN}
              max={FIELD_CONSTRAINTS.COMMITMENT_VALUE_MAX}
              maxDigits={0}
              disabled={!!readonly}
              className="min-w-element-2xl w-min"
            />

            <ContractFormIntervalSelector<"commitment_period_unit">
              fieldName="commitment_period_unit"
              nbIntervals={commitmentPeriodValue ?? 0}
              readonly={!!readonly}
              className="mt-[28px]" // Align with Number field input
            />
          </div>

          <Alert
            className="mt-sm max-w-[420px]"
            status="info"
            layout="inline"
            customIcon="info-circle"
          >
            {t("formFields.commitmentPeriod.alertInfo")}
          </Alert>
        </div>
      )}
    </>
  );
};
