import React, { useCallback, useEffect, useId } from "react";

import { useFormContext } from "@bsport/form";

import type { CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import { FormPriceField } from "#src/components/form/price-field";
import { i18nInstance, useTranslation } from "#src/i18n";

function getResetCts(
  selectedItemId: string | null,
  defaultCts: number,
  isCustomAmount: boolean,
  customMinCts?: number,
): number {
  if (!selectedItemId) return 0;
  if (isCustomAmount) return customMinCts ?? 0;
  return defaultCts;
}

type PriceFieldProps = {
  /** Custom amount giftcard: min/max in cents from the selected item. */
  customAmountMinCts?: number;
  customAmountMaxCts?: number;
};

export const PriceField: React.FC<PriceFieldProps> = ({
  customAmountMinCts,
  customAmountMaxCts,
}) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const { watch, setValue } = useFormContext<CheckoutFlowFormState>();
  const priceFieldId = `price-${useId()}`;

  const selectedItemType = watch("addItemSelectedItemType");
  const selectedItemId = watch("addItemSelectedItemId");
  const selectedItemPriceCts = watch("addItemSelectedItemPriceCts");

  const isCustomAmount =
    selectedItemType === "giftcard" &&
    selectedItemId &&
    selectedItemPriceCts === 0;

  const customMinCts =
    customAmountMinCts != null && customAmountMinCts >= 0
      ? customAmountMinCts
      : undefined;
  const customMaxCts =
    customAmountMaxCts != null && customAmountMaxCts > 0
      ? customAmountMaxCts
      : undefined;
  const normalizedCustomMaxCts =
    customMinCts != null && customMaxCts != null && customMaxCts < customMinCts
      ? undefined
      : customMaxCts;

  const defaultCts = selectedItemPriceCts ?? 0;
  const maxCts =
    selectedItemPriceCts != null && selectedItemPriceCts > 0
      ? selectedItemPriceCts
      : undefined;

  const resetDiscount = useCallback(
    (shouldDirty: boolean) => {
      setValue("addItemApplyDiscount", false, { shouldDirty });
      setValue("addItemDiscountPercent", 0, { shouldDirty });
      setValue("addItemDiscountAmountCts", 0, { shouldDirty });
    },
    [setValue],
  );

  const handlePriceCtsChange = useCallback(
    (cts: number) => {
      const originalPriceCts = selectedItemPriceCts ?? 0;

      if (originalPriceCts > 0 && cts < originalPriceCts) {
        const amountCts = originalPriceCts - cts;
        setValue("addItemApplyDiscount", true, { shouldDirty: true });
        setValue("addItemDiscountAmountCts", amountCts, { shouldDirty: true });
        setValue(
          "addItemDiscountPercent",
          Math.round((amountCts / originalPriceCts) * 10000) / 100,
          { shouldDirty: true },
        );
      } else {
        resetDiscount(true);
      }
    },
    [setValue, resetDiscount, selectedItemPriceCts],
  );

  // Reset price and discount when selection or mode changes.
  useEffect(() => {
    const resetCts = getResetCts(
      selectedItemId,
      defaultCts,
      Boolean(isCustomAmount),
      customMinCts,
    );
    setValue("addItemPriceCts", resetCts, { shouldDirty: false });
    resetDiscount(false);
  }, [
    selectedItemId,
    defaultCts,
    isCustomAmount,
    customMinCts,
    setValue,
    resetDiscount,
  ]);

  if (isCustomAmount) {
    const minCts = customMinCts ?? 0;
    const maxCtsCustom = normalizedCustomMaxCts;

    const helperText =
      customMinCts != null && normalizedCustomMaxCts != null
        ? t("checkoutFlowModal.customValueHelper", {
            min: customMinCts / 100,
            max: normalizedCustomMaxCts / 100,
          })
        : undefined;

    return (
      <FormPriceField<CheckoutFlowFormState, "addItemPriceCts">
        id={priceFieldId}
        fieldName="addItemPriceCts"
        minCts={minCts}
        maxCts={maxCtsCustom}
        allowDecimals={false}
        disabled={!selectedItemId}
        label={t("checkoutFlowModal.customValue")}
        helperText={helperText}
        onPriceChange={handlePriceCtsChange}
      />
    );
  }

  return (
    <FormPriceField<CheckoutFlowFormState, "addItemPriceCts">
      id={priceFieldId}
      fieldName="addItemPriceCts"
      maxCts={maxCts}
      disabled={!selectedItemId || selectedItemPriceCts === 0}
      label={t("checkoutFlowModal.price")}
      onPriceChange={handlePriceCtsChange}
    />
  );
};
