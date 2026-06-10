import type { FC } from "react";

import { FormNumberField } from "@bsport/kaizen-business-components/form/number-field";

import { RadioButtonWithChildren } from "#src/components/radio-button-with-children";
import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { ContractFormData, ContractFormMethods } from "../types";
import { ContractFormIntervalSelector } from "./contract-form-interval-selector";

type ContractFormBillingCycleProps = {
  formId: string;
  readonly?: boolean;
  methods: ContractFormMethods;
};

const RADIO_VALUES = {
  CUSTOM_INTERVAL: "custom-interval",
  FIXED_DAY: "fixed-day",
} as const;

export const ContractFormBillingCycle: FC<ContractFormBillingCycleProps> = ({
  formId,
  readonly,
  methods,
}) => {
  const { t } = useTranslation("contract-details");

  const hasCustomInterval = methods.watch("hasCustomInterval");
  const handleChangeRadio = (value: boolean) => {
    methods.setValue("hasCustomInterval", value, { shouldDirty: true });
  };
  const recurrenceBasis = methods.watch("recurrence_basis");

  return (
    <fieldset
      className="flex flex-col w-fit gap-xs text-onsurface-default text-body-md leading-sm"
      role="radiogroup"
      id={`${formId}-billing-cycle`}
    >
      <RadioButtonWithChildren
        label={t("formFields.billingCycle.radioPurchaseDay.label")}
        value={RADIO_VALUES.CUSTOM_INTERVAL}
        checked={hasCustomInterval}
        onChange={() => handleChangeRadio(true)}
        disabled={!!readonly}
        information={t("formFields.billingCycle.radioPurchaseDay.tooltip")}
      >
        <div className="flex flex-row gap-2xs items-start">
          <FormNumberField<ContractFormData, "recurrence_basis">
            fieldName="recurrence_basis"
            id={`${formId}-billing-cycle-recurrence-basis`}
            required
            label={t("formFields.billingCycle.radioPurchaseDay.sublabel")}
            min={FIELD_CONSTRAINTS.RECURRENCE_BASIS_MIN}
            maxDigits={0}
            disabled={!!readonly}
            className="min-w-element-2xl w-min"
            customNode={
              <ContractFormIntervalSelector<"interval">
                fieldName="interval"
                nbIntervals={recurrenceBasis}
                readonly={!!readonly}
              />
            }
          />
        </div>
      </RadioButtonWithChildren>

      <RadioButtonWithChildren
        label={t("formFields.billingCycle.radioFixedDay.label")}
        value={RADIO_VALUES.FIXED_DAY}
        checked={!hasCustomInterval}
        onChange={() => handleChangeRadio(false)}
        disabled={!!readonly}
        information={t("formFields.billingCycle.radioFixedDay.tooltip")}
      >
        <FormNumberField<ContractFormData, "month_billing_day">
          fieldName="month_billing_day"
          id={`${formId}-billing-cycle-month-billing-day`}
          required
          label={t("formFields.billingCycle.radioFixedDay.sublabel")}
          min={FIELD_CONSTRAINTS.MONTH_DAY_MIN}
          max={FIELD_CONSTRAINTS.MONTH_DAY_MAX}
          maxDigits={0}
          disabled={!!readonly}
          className="w-min"
        />
      </RadioButtonWithChildren>
    </fieldset>
  );
};
