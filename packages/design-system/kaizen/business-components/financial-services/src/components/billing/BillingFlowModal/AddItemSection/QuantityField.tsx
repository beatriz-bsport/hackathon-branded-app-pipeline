import React, { useId } from "react";

import { FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export const QuantityField: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const quantityFieldId = `quantity-${useId()}`;

  return (
    <FormField<BillingFlowFormState, "addItemQuantity", TextFieldProps>
      name="addItemQuantity"
      mapProps={({ form: { setValue }, field }) => ({
        value: String(field.value),
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          const digitsOnly = value.replace(/[^0-9]/g, "");

          if (digitsOnly === "") {
            setValue("addItemQuantity", 1, { shouldDirty: true });
            return;
          }

          const num = parseInt(digitsOnly, 10);
          const nextQuantity =
            !Number.isNaN(num) && num >= 1 ? num : field.value;
          setValue("addItemQuantity", nextQuantity, { shouldDirty: true });
        },
      })}
    >
      <TextField
        className="w-[104px]"
        id={quantityFieldId}
        label={t("billingFlowModal.quantity")}
        type="number"
        min={1}
        required
      />
    </FormField>
  );
};
