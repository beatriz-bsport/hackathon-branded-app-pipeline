import { type FC } from "react";

import type { SavedPaymentMethod } from "@bsport/api-financial-services/payment-method";
import { Body } from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import { PaymentMethodCard } from "./payment-method-card";

type Props = {
  /** Current saved payment method to display, if any. */
  paymentMethod?: SavedPaymentMethod;
};

/**
 * Summary card for a saved payment method.
 *
 * Renders the current saved method as a summary card, or an empty state when
 * none is set. Editing is owned by consuming applications.
 */
export const PaymentMethodDisplay: FC<Props> = ({ paymentMethod }) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });

  if (!paymentMethod) {
    return (
      <Body size="md" color="weak">
        {t("paymentMethod.display.emptyTitle")}
      </Body>
    );
  }

  return <PaymentMethodCard paymentMethod={paymentMethod} />;
};

PaymentMethodDisplay.displayName = "KaizenPaymentMethodDisplay";
