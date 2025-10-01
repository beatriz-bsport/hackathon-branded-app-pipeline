import React from "react";

import { FormField } from "@bsport/form";
import {
  CheckboxGroup,
  type CheckboxGroupProps,
} from "@bsport/kaizen-primitive-core";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import { PAYMENT_METHOD_IDENTIFIERS } from "../schema";

type PackFormPricingPaymentMethodsProps = {
  fieldIdPrefix: string;
};

export const PackFormPricingPaymentMethods: React.FC<
  PackFormPricingPaymentMethodsProps
> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("details");

  return (
    <FormField<
      PackFormData,
      "available_payment_method_identifiers",
      CheckboxGroupProps
    >
      name="available_payment_method_identifiers"
      mapProps={({ defaultProps, field, form }) => {
        const parsedValue = Array.isArray(field.value)
          ? field.value.map(String) // ensure it's string[] for CheckboxGroup
          : [];

        const setter = (ids: string[]) => {
          form.setValue(
            "available_payment_method_identifiers",
            ids.map((id) => parseInt(id, 10)),
            { shouldValidate: true, shouldDirty: true },
          );
        };

        return {
          ...defaultProps,
          checkedIds: parsedValue,
          setCheckedIds: (input: string[] | ((prev: string[]) => string[])) => {
            // Represent a Dispatch<SetStateAction<string[]>>
            if (typeof input === "function") {
              const next = input(parsedValue);
              setter(next);
            } else {
              setter(input);
            }
          },
          value: parsedValue,
          onChange: undefined,
          ref: undefined,
          status: "critical",
        };
      }}
    >
      <CheckboxGroup
        id={`${fieldIdPrefix}-pack-payment-methods-checkboxes`}
        label={t("formFields.pricingSection.paymentMethod.label")}
        helperText={t("formFields.pricingSection.paymentMethod.helperText")}
        options={[
          {
            id: String(PAYMENT_METHOD_IDENTIFIERS.ONLINE_PAYMENTS_ID),
            label: t(
              "formFields.pricingSection.paymentMethod.checkboxes.onlinePayments",
            ),
          },
          {
            id: String(PAYMENT_METHOD_IDENTIFIERS.ONSITE_PAYMENTS_ID),
            label: t(
              "formFields.pricingSection.paymentMethod.checkboxes.onsitePayments",
            ),
          },
        ]}
        required
        status="critical"
      />
    </FormField>
  );
};
