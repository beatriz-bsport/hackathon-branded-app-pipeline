import React, { useCallback, useEffect, useId, useState } from "react";

import { getCurrencyDisplay } from "@bsport/currency";
import { FormField, useFormContext } from "@bsport/form";
import {
  FormRadioGroup,
  TextArea,
  type TextAreaProps,
  TextField,
  type TextFieldProps,
  Toggle,
  type ToggleProps,
} from "@bsport/kaizen-primitive-core";

import type { CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import { i18nInstance, useTranslation } from "#src/i18n";

const DISCOUNT_MODE_PERCENTAGE = "percentage";
const DISCOUNT_MODE_AMOUNT = "amount";
const AMOUNT_INPUT_PATTERN = /^\d*(?:[.,]\d{0,2})?$/;
const DISCOUNT_REASON_MAX_LENGTH = 100;

export const AddProductDiscount: React.FC = () => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const { watch, setValue } = useFormContext<CheckoutFlowFormState>();

  const [discountMode, setDiscountMode] = useState<
    typeof DISCOUNT_MODE_PERCENTAGE | typeof DISCOUNT_MODE_AMOUNT
  >(DISCOUNT_MODE_PERCENTAGE);

  const [amountInputValue, setAmountInputValue] = useState("0.00");

  const radioGroupId = useId();
  const percentFieldId = useId();
  const amountFieldId = `checkout-flow-discount-amount-${useId()}`;
  const discountToggleId = useId();
  const discountReasonId = useId();

  const selectedItemId = watch("addItemSelectedItemId");
  const originalPriceCts = watch("addItemSelectedItemPriceCts");
  const applyDiscount = watch("addItemApplyDiscount");
  const discountAmountCts = watch("addItemDiscountAmountCts");
  const discountReason = watch("addItemDiscountReason");
  const isDiscountReasonRequired = watch("isDiscountReasonRequired");
  const isToggleChecked = watch("addItemApplyDiscount");

  const isDiscountDisabled = !selectedItemId || originalPriceCts <= 0;

  // Sync amountInputValue when discountAmountCts changes externally (not while focused)
  useEffect(() => {
    if (document.activeElement?.id === amountFieldId) return;
    setAmountInputValue((discountAmountCts / 100).toFixed(2));
  }, [discountAmountCts, amountFieldId]);

  const resetDiscountValues = useCallback(() => {
    setValue("addItemDiscountPercent", 0, { shouldDirty: true });
    setValue("addItemDiscountAmountCts", 0, { shouldDirty: true });
    setValue("addItemPriceCts", originalPriceCts, { shouldDirty: true });
    setValue("addItemDiscountReason", "", { shouldDirty: true });
    setAmountInputValue("0.00");
  }, [setValue, originalPriceCts]);

  const updateFromPercent = useCallback(
    (pct: number) => {
      const amountCts = Math.round((originalPriceCts * pct) / 100);
      const newPriceCts = originalPriceCts - amountCts;
      setValue("addItemDiscountPercent", pct, { shouldDirty: true });
      setValue("addItemDiscountAmountCts", amountCts, { shouldDirty: true });
      setValue("addItemPriceCts", newPriceCts, { shouldDirty: true });
    },
    [setValue, originalPriceCts],
  );

  const updateFromAmountCts = useCallback(
    (amountCts: number) => {
      const newPriceCts = originalPriceCts - amountCts;
      const pct = Math.round((amountCts / originalPriceCts) * 10000) / 100;
      setValue("addItemDiscountAmountCts", amountCts, { shouldDirty: true });
      setValue("addItemDiscountPercent", pct, { shouldDirty: true });
      setValue("addItemPriceCts", newPriceCts, { shouldDirty: true });
    },
    [setValue, originalPriceCts],
  );

  return (
    <div className="flex flex-col gap-md">
      <FormField<CheckoutFlowFormState, "addItemApplyDiscount", ToggleProps>
        name="addItemApplyDiscount"
        mapProps={({ form: { setValue: setFormValue } }) => ({
          onToggleChange: (checked: boolean) => {
            setFormValue("addItemApplyDiscount", checked, {
              shouldDirty: true,
            });
            if (!checked) {
              resetDiscountValues();
            }
          },
        })}
      >
        <Toggle
          id={`checkout-flow-discount-toggle-${discountToggleId}`}
          label={t("checkoutFlowModal.applyDiscount")}
          checked={isToggleChecked}
          disabled={isDiscountDisabled}
        />
      </FormField>

      {applyDiscount && originalPriceCts > 0 && (
        <div className="pl-[40px] flex flex-col gap-md">
          <FormRadioGroup
            id={`checkout-flow-discount-mode-${radioGroupId}`}
            options={[
              {
                label: t("checkoutFlowModal.discountTypePercentage"),
                value: DISCOUNT_MODE_PERCENTAGE,
                element: (
                  <FormField<
                    CheckoutFlowFormState,
                    "addItemDiscountPercent",
                    TextFieldProps
                  >
                    name="addItemDiscountPercent"
                    mapProps={({ field }) => ({
                      value:
                        field.value % 1 === 0
                          ? String(field.value)
                          : field.value.toFixed(2),
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        const normalized = e.target.value
                          .trim()
                          .replace(/,/g, ".");
                        if (normalized === "") {
                          resetDiscountValues();
                          return;
                        }
                        const parsed = parseFloat(normalized);
                        if (!Number.isFinite(parsed) || parsed < 0) return;
                        const pct =
                          Math.round(Math.min(100, Math.max(0, parsed)) * 100) /
                          100;
                        updateFromPercent(pct);
                      },
                    })}
                  >
                    <TextField
                      id={`checkout-flow-discount-percent-${percentFieldId}`}
                      className="w-[104px]"
                      type="number"
                      min={0}
                      max={100}
                      suffix={{ type: "text", value: "%" }}
                      disabled={discountMode !== DISCOUNT_MODE_PERCENTAGE}
                    />
                  </FormField>
                ),
              },
              {
                label: t("checkoutFlowModal.discountTypeAmount"),
                value: DISCOUNT_MODE_AMOUNT,
                element: (
                  <FormField<
                    CheckoutFlowFormState,
                    "addItemDiscountAmountCts",
                    TextFieldProps
                  >
                    name="addItemDiscountAmountCts"
                    mapProps={({ field }) => ({
                      value: amountInputValue,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        if (!AMOUNT_INPUT_PATTERN.test(value)) return;
                        setAmountInputValue(value);

                        const normalized = value.trim().replace(/,/g, ".");
                        if (normalized === "") {
                          resetDiscountValues();
                          return;
                        }
                        const parsed = parseFloat(normalized);
                        if (!Number.isFinite(parsed) || parsed < 0) return;
                        const amountCts = Math.min(
                          originalPriceCts,
                          Math.max(0, Math.round(parsed * 100)),
                        );
                        updateFromAmountCts(amountCts);
                      },
                      onBlur: () => {
                        setAmountInputValue((field.value / 100).toFixed(2));
                      },
                    })}
                  >
                    <TextField
                      id={amountFieldId}
                      className="w-[104px]"
                      type="number"
                      min={0}
                      step={0.01}
                      inputMode="decimal"
                      suffix={{ type: "text", value: getCurrencyDisplay() }}
                      disabled={discountMode !== DISCOUNT_MODE_AMOUNT}
                    />
                  </FormField>
                ),
              },
            ]}
            value={discountMode}
            onChange={(e) =>
              setDiscountMode(
                e.target.value as
                  | typeof DISCOUNT_MODE_PERCENTAGE
                  | typeof DISCOUNT_MODE_AMOUNT,
              )
            }
            disabled={isDiscountDisabled}
            direction="start"
          />

          <FormField<
            CheckoutFlowFormState,
            "addItemDiscountReason",
            TextAreaProps
          >
            name="addItemDiscountReason"
            mapProps={({ form: { setValue: setFormValue }, field }) => ({
              value: field.value,
              onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setFormValue("addItemDiscountReason", e.target.value, {
                  shouldDirty: true,
                });
              },
            })}
          >
            <TextArea
              id={`checkout-flow-discount-reason-${discountReasonId}`}
              label={t("checkoutFlowModal.discountReason")}
              placeholder={t("checkoutFlowModal.discountReasonPlaceholder")}
              helperText={`${discountReason.length}/${DISCOUNT_REASON_MAX_LENGTH}`}
              maxLength={DISCOUNT_REASON_MAX_LENGTH}
              required={isDiscountReasonRequired}
            />
          </FormField>
        </div>
      )}
    </div>
  );
};
