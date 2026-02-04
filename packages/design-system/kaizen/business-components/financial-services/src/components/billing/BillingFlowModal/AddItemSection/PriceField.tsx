import React, { useEffect, useId, useState } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import {
  type BillingFlowFormState,
  PRICE_INPUT_PATTERN,
} from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export const PriceField: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const { watch, setValue } = useFormContext<BillingFlowFormState>();
  const priceFieldId = `price-${useId()}`;
  const [priceInputValue, setPriceInputValue] = useState<string>("");

  const priceCts = watch("addItemPriceCts");
  const selectedItemId = watch("addItemSelectedItemId");
  const selectedItemPriceCts = watch("addItemSelectedItemPriceCts");

  useEffect(() => {
    if (selectedItemId != null) {
      setValue("addItemPriceCts", selectedItemPriceCts, { shouldDirty: false });
      setPriceInputValue((selectedItemPriceCts / 100).toFixed(2));
    } else {
      setValue("addItemPriceCts", 0, { shouldDirty: false });
      setPriceInputValue("0.00");
    }
  }, [selectedItemId, selectedItemPriceCts, setValue]);

  useEffect(() => {
    if (document.activeElement?.id === priceFieldId) return;
    if (priceCts === null) {
      setPriceInputValue("");
    } else {
      setPriceInputValue((priceCts / 100).toFixed(2));
    }
  }, [priceCts, priceFieldId]);

  return (
    <FormField<BillingFlowFormState, "addItemPriceCts", TextFieldProps>
      name="addItemPriceCts"
      mapProps={({ form: { setValue: setFormValue }, field }) => ({
        value: priceInputValue,
        disabled: !selectedItemId,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          if (!PRICE_INPUT_PATTERN.test(value)) return;
          setPriceInputValue(value);
          const normalized = value.trim().replace(/,/g, ".");
          if (normalized === "") {
            setFormValue("addItemPriceCts", 0, { shouldDirty: true });
            return;
          }
          const parsed = parseFloat(normalized);
          if (!Number.isFinite(parsed) || parsed < 0) return;
          const maxCts =
            selectedItemPriceCts > 0 ? selectedItemPriceCts : Infinity;
          const newPriceCts = Math.min(Math.round(parsed * 100), maxCts);
          setFormValue("addItemPriceCts", newPriceCts ?? 0, {
            shouldDirty: true,
          });
        },
        onBlur: () => {
          const valueCts = field.value ?? 0;
          setPriceInputValue(valueCts === 0 ? "" : (valueCts / 100).toFixed(2));
        },
      })}
    >
      <TextField
        className="w-[104px]"
        id={priceFieldId}
        label={t("billingFlowModal.price")}
        type="number"
        min={0}
        step="0.01"
        inputMode="decimal"
      />
    </FormField>
  );
};
