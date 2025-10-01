import React from "react";

import { getCurrencyCode, getCurrencyDisplayWithPrice } from "@bsport/currency";
import { FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useSelectedItems } from "#src/hooks/useSelectedItems";
import { useTranslation } from "#src/utils/i18n";

import { FIELD_PRICE_MINIMUM } from "../schema";

type PackFormPricingPriceProps = {
  fieldIdPrefix: string;
};

export const PackFormPricingPrice: React.FC<PackFormPricingPriceProps> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("details");

  const { totalPackValue } = useSelectedItems();

  return (
    <FormField<PackFormData, "price", TextFieldProps>
      name="price"
      mapProps={({ defaultProps, field, form }) => ({
        ...defaultProps,
        onClear: () => {
          form.setValue("price", 0, { shouldDirty: true });
          field.onBlur();
        },
        value:
          defaultProps.value === null || defaultProps.value === undefined
            ? ""
            : String(defaultProps.value),
        min: FIELD_PRICE_MINIMUM,
      })}
    >
      <TextField
        id={`${fieldIdPrefix}-pack-price`}
        label={t("formFields.pricingSection.price.label")}
        required
        type="number"
        suffix={{
          type: "text",
          value: getCurrencyCode().toLocaleUpperCase(),
        }}
        placeholder={totalPackValue.toString()}
        helperText={t("formFields.pricingSection.price.helperText", {
          amount: getCurrencyDisplayWithPrice(totalPackValue),
        })}
      />
    </FormField>
  );
};
