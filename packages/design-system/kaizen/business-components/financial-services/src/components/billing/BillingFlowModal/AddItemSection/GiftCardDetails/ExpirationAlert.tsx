import React from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { useFormContext } from "@bsport/form";
import { Alert } from "@bsport/kaizen-primitive-core";

import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export const ExpirationAlert: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const { watch } = useFormContext<BillingFlowFormState>();

  const originalPriceCts = watch("addItemSelectedItemPriceCts");
  const expirationDays = watch("addItemSelectedItemExpirationDays");

  if (expirationDays === null) return null;

  const balanceFormatted = getCurrencyDisplayWithPrice(originalPriceCts / 100);

  return (
    <Alert status="default" type="weak" layout="banner">
      {t("billingFlowModal.giftCardDetails.alertValidOnceActivated", {
        days: expirationDays,
        amount: balanceFormatted,
      })}
    </Alert>
  );
};
