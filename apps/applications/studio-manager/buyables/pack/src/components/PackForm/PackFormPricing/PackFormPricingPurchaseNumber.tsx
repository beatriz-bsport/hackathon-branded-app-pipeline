import React from "react";

import { FormField, type UseFormControllerOutput } from "@bsport/form";
import {
  TextField,
  type TextFieldProps,
  Toggle,
} from "@bsport/kaizen-primitive-core";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_MAX_NB_PURCHASE_MINIMUM, type PackFormSchema } from "../schema";

type PackFormPricingPurchaseNumberProps = {
  fieldIdPrefix: string;
  methods: UseFormControllerOutput<PackFormSchema>;
};

export const PackFormPricingPurchaseNumber: React.FC<
  PackFormPricingPurchaseNumberProps
> = ({ fieldIdPrefix, methods }) => {
  const { t } = useTranslation("details");

  const maxPurchaseNumber = methods.watch("max_purchase_per_member");
  const addMaxNbOfPurchases =
    maxPurchaseNumber !== null && maxPurchaseNumber !== undefined;

  return (
    <>
      <Toggle
        checked={addMaxNbOfPurchases}
        id={`${fieldIdPrefix}-pack-max-nb-purchase-toggle`}
        label={t("formFields.pricingSection.maxPurchaseToggle.description")}
        onToggleChange={(checked) => {
          if (checked) {
            methods.setValue(
              "max_purchase_per_member",
              maxPurchaseNumber ?? 0,
              {
                shouldDirty: true,
              },
            );
          } else {
            methods.setValue("max_purchase_per_member", null, {
              shouldDirty: true,
            });
          }
        }}
      />
      {addMaxNbOfPurchases && (
        <FormField<
          PackFormData,
          "max_purchase_per_member",
          Omit<TextFieldProps, "value"> & { value?: number | null }
        >
          name="max_purchase_per_member"
          mapProps={({ defaultProps, field, form }) => ({
            ...defaultProps,
            onClear: () => {
              form.setValue("max_purchase_per_member", 0, {
                shouldDirty: true,
              });
              field.onBlur();
            },
            value: defaultProps.value ?? 0,
            min: FIELD_MAX_NB_PURCHASE_MINIMUM,
          })}
        >
          <TextField
            id={`${fieldIdPrefix}-pack-max-nb-purchase-value`}
            label={t("formFields.pricingSection.maxPurchaseToggle.label")}
            required={addMaxNbOfPurchases}
            type="number"
            containerProps={{
              className: "ml-[40px]",
            }}
          />
        </FormField>
      )}
    </>
  );
};
