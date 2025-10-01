import React from "react";

import { FormField, type useFormController } from "@bsport/form";
import {
  TextField,
  type TextFieldProps,
  Toggle,
  type ToggleProps,
} from "@bsport/kaizen-primitive-core";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import {
  FIELD_TAX_RATE_MAXIMUM,
  FIELD_TAX_RATE_MINIMUM,
  type PackFormSchema,
} from "../schema";

type PackFormPricingTaxProps = {
  fieldIdPrefix: string;
  watch: ReturnType<typeof useFormController<PackFormSchema>>["watch"];
};

export const PackFormPricingTax: React.FC<PackFormPricingTaxProps> = ({
  fieldIdPrefix,
  watch,
}) => {
  const { t } = useTranslation("details");
  const applySingleTax = watch("use_payment_combo_tax_on_items");

  return (
    <>
      <FormField<PackFormData, "use_payment_combo_tax_on_items", ToggleProps>
        name="use_payment_combo_tax_on_items"
        mapProps={({ defaultProps, field }) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { statusText, ...otherDefaultProps } = defaultProps;
          return {
            ...otherDefaultProps,
            // Required to avoid conflict with typing of Toggle.value
            value:
              defaultProps.value === null || defaultProps.value === undefined
                ? ""
                : String(defaultProps.value),

            checked: field.value,
          };
        }}
      >
        {/** @ts-expect-error Pass props implicitely - FormField is forwarding the `checked` props */}
        <Toggle
          id={`${fieldIdPrefix}-pack-unique-tax-toggle`}
          label={t("formFields.pricingSection.taxToggle.description")}
          helperText={t("formFields.pricingSection.taxToggle.helperText")}
        />
      </FormField>

      {applySingleTax && (
        <FormField<PackFormData, "tax", TextFieldProps>
          name="tax"
          mapProps={({ defaultProps, field, form }) => {
            return {
              ...defaultProps,
              onClear: () => {
                form.setValue("tax", 0, { shouldDirty: true });
                field.onBlur();
              },
              // TextField handles strings. We parse the value before sending the data, as well in zod schema with coerse
              value: String(defaultProps.value),
              min: FIELD_TAX_RATE_MINIMUM,
              max: FIELD_TAX_RATE_MAXIMUM,
            };
          }}
        >
          <TextField
            id={`${fieldIdPrefix}-pack-unique-tax-value`}
            label={t("formFields.pricingSection.taxToggle.label")}
            type="number"
            required={applySingleTax}
            suffix={{ type: "text", value: "%" }}
            containerProps={{
              className: "ml-[40px]",
            }}
          />
        </FormField>
      )}
    </>
  );
};
