import React from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { useFormContext } from "@bsport/form";
import { Alert } from "@bsport/kaizen-primitive-core";

import type { CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import { i18nInstance, useTranslation } from "#src/i18n";

export const ExpirationAlert: React.FC = () => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const { watch } = useFormContext<CheckoutFlowFormState>();

  const originalPriceCts = watch("addItemSelectedItemPriceCts");
  const expirationDays = watch("addItemSelectedItemExpirationDays");

  if (expirationDays === null) return null;

  const balanceFormatted = getCurrencyDisplayWithPrice(originalPriceCts / 100);

  return (
    <Alert status="default" type="weak" layout="banner">
      {t("checkoutFlowModal.giftCardDetails.alertValidOnceActivated", {
        days: expirationDays,
        amount: balanceFormatted,
      })}
    </Alert>
  );
};
