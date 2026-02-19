import React, { useId, useState } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { FormField, useFormContext } from "@bsport/form";
import {
  Body,
  Button,
  Divider,
  TextField,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import { useApplyPromoCodeToInvoice } from "#src/components/billing/BillingFlowModal/hooks/use-apply-promo-code-to-invoice";
import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export const PromoCodeSection: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const { watch } = useFormContext<BillingFlowFormState>();

  const [showPromoCodeInput, setShowPromoCodeInput] = useState(false);

  const inputId = `promo-code-${useId()}`;
  const promoCodes = watch("promoCodes");
  const promoCode = watch("promoCode") ?? "";
  const member = watch("member");
  const memberId = member?.id;

  const {
    appliedCoupons,
    isApplyingPromoCode,
    errorMessage,
    applyPromoCode,
    removePromoCode,
  } = useApplyPromoCodeToInvoice();

  const handleAddPromoCode = async () => {
    const code = promoCode.trim();
    if (!code || !memberId) return;

    const success = await applyPromoCode(code);
    if (success) {
      setShowPromoCodeInput(false);
    }
  };

  return (
    <div className="flex flex-col">
      {promoCodes.length > 0 && (
        <div className="flex flex-col px-md">
          {promoCodes.map((code, index) => {
            const coupon = appliedCoupons[index];
            const voucher = coupon ? -1 * coupon.voucher : 0;
            return (
              <div
                key={`promocode-${index}`}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-2xs">
                  <Body
                    htmlVariant="span"
                    size="md"
                    color="default"
                    weight="weak"
                  >
                    {t("billingFlowModal.promoCode.detail", { code })}
                  </Body>
                  <Button
                    intent="flat"
                    color="critical"
                    size="md"
                    icon="trash-01"
                    kind="icon-button"
                    onClick={() => removePromoCode(index)}
                    label={t("billingFlowModal.promoCode.removeLabel")}
                  />
                </div>
                <Body
                  htmlVariant="span"
                  size="md"
                  color="positive"
                  weight="strong"
                >
                  {getCurrencyDisplayWithPrice(voucher)}
                </Body>
              </div>
            );
          })}
        </div>
      )}

      {!showPromoCodeInput ? (
        <Button
          className="w-fit"
          intent="flat"
          color="main"
          size="md"
          label={t("billingFlowModal.addPromoCode")}
          onClick={() => setShowPromoCodeInput(true)}
        />
      ) : (
        <div className="flex gap-xs items-end px-md">
          <FormField<BillingFlowFormState, "promoCode", TextFieldProps>
            name="promoCode"
            mapProps={({ field }) => ({
              value: field.value || "",
              onChange: (e) => field.onChange(e.target.value),
              onClear: () => field.onChange(""),
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddPromoCode();
                }
              },
            })}
          >
            <TextField
              id={inputId}
              label={t("billingFlowModal.promoCode.addLabel")}
            />
          </FormField>
          <Button
            intent="default"
            color="main"
            size="md"
            label={t("billingFlowModal.promoCode.addButton")}
            onClick={handleAddPromoCode}
            disabled={!promoCode.trim() || !memberId || isApplyingPromoCode}
            loading={isApplyingPromoCode}
          />
        </div>
      )}

      {errorMessage && (
        <Body
          htmlVariant="span"
          size="sm"
          color="critical"
          className="px-md mt-xs"
        >
          {errorMessage}
        </Body>
      )}

      {promoCodes.length > 0 && <Divider className="mt-sm" weight="thin" />}
    </div>
  );
};
