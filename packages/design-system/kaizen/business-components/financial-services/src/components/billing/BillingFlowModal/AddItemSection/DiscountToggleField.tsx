import React, { useId } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Toggle, type ToggleProps } from "@bsport/kaizen-primitive-core";

import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import type { BillingFlowFormState } from "../schema";

export const DiscountToggleField: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const discountToggleId = `discount-${useId()}`;

  const { watch } = useFormContext<BillingFlowFormState>();
  const checked = watch("addItemApplyDiscount");

  return (
    <FormField<BillingFlowFormState, "addItemApplyDiscount", ToggleProps>
      name="addItemApplyDiscount"
      mapProps={({ form: { setValue } }) => ({
        onToggleChange: (nextChecked: boolean) => {
          setValue("addItemApplyDiscount", nextChecked, { shouldDirty: true });
          // TODO: Implement discount logic (restore price when uncheck, etc.)
        },
      })}
    >
      {/* TODO: Implement discount logic */}
      <Toggle
        id={discountToggleId}
        label={t("billingFlowModal.applyDiscount")}
        checked={checked}
        disabled={true}
      />
    </FormField>
  );
};
