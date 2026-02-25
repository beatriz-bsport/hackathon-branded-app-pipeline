import React, { useCallback, useEffect, useId, useState } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import {
  type CheckoutFlowFormState,
  PRICE_INPUT_PATTERN,
} from "#src/components/core/checkout-flow-modal/schema";
import { i18nInstance, useTranslation } from "#src/i18n";

export const PriceField: React.FC = () => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const { watch, setValue } = useFormContext<CheckoutFlowFormState>();
  const priceFieldId = `price-${useId()}`;
  const [priceInputValue, setPriceInputValue] = useState<string>("");

  const priceCts = watch("addItemPriceCts");
  const selectedItemId = watch("addItemSelectedItemId");
  const selectedItemPriceCts = watch("addItemSelectedItemPriceCts");

  const resetDiscount = useCallback(
    (shouldDirty: boolean) => {
      setValue("addItemApplyDiscount", false, { shouldDirty });
      setValue("addItemDiscountPercent", 0, { shouldDirty });
      setValue("addItemDiscountAmountCts", 0, { shouldDirty });
    },
    [setValue],
  );

  const updateDiscountFromPrice = useCallback(
    (newPriceCts: number, originalPriceCts: number) => {
      if (originalPriceCts > 0 && newPriceCts < originalPriceCts) {
        const discountAmountCts = originalPriceCts - newPriceCts;
        const discountPercent =
          Math.round((discountAmountCts / originalPriceCts) * 10000) / 100;
        setValue("addItemApplyDiscount", true, { shouldDirty: true });
        setValue("addItemDiscountAmountCts", discountAmountCts, {
          shouldDirty: true,
        });
        setValue("addItemDiscountPercent", discountPercent, {
          shouldDirty: true,
        });
      } else {
        resetDiscount(true);
      }
    },
    [setValue, resetDiscount],
  );

  // Sync price and reset discount when selected item changes
  useEffect(() => {
    if (selectedItemId != null) {
      setValue("addItemPriceCts", selectedItemPriceCts, { shouldDirty: false });
      setPriceInputValue((selectedItemPriceCts / 100).toFixed(2));
    } else {
      setValue("addItemPriceCts", 0, { shouldDirty: false });
      setPriceInputValue("0.00");
    }
    resetDiscount(false);
  }, [selectedItemId, selectedItemPriceCts, setValue, resetDiscount]);

  // Sync input display when priceCts changes externally (not while focused)
  useEffect(() => {
    if (document.activeElement?.id === priceFieldId) return;
    const valueCts = priceCts ?? 0;
    setPriceInputValue(valueCts === 0 ? "" : (valueCts / 100).toFixed(2));
  }, [priceCts, priceFieldId]);

  return (
    <FormField<CheckoutFlowFormState, "addItemPriceCts", TextFieldProps>
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
            resetDiscount(true);
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
          updateDiscountFromPrice(newPriceCts, selectedItemPriceCts);
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
        label={t("checkoutFlowModal.price")}
        type="number"
        min={0}
        step={0.01}
        inputMode="decimal"
      />
    </FormField>
  );
};
