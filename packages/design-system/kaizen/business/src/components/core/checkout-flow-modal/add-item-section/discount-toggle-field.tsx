import React, { useId } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Toggle, type ToggleProps } from "@bsport/kaizen-primitive-core";

import type { CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import { i18nInstance, useTranslation } from "#src/i18n";

export const DiscountToggleField: React.FC = () => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const discountToggleId = `discount-${useId()}`;

  const { watch } = useFormContext<CheckoutFlowFormState>();
  const checked = watch("addItemApplyDiscount");

  return (
    <FormField<CheckoutFlowFormState, "addItemApplyDiscount", ToggleProps>
      name="addItemApplyDiscount"
      mapProps={({ form: { setValue } }) => ({
        onToggleChange: (nextChecked: boolean) => {
          setValue("addItemApplyDiscount", nextChecked, { shouldDirty: true });
        },
      })}
    >
      <Toggle
        id={discountToggleId}
        label={t("checkoutFlowModal.applyDiscount")}
        checked={checked}
        disabled={true}
      />
    </FormField>
  );
};
