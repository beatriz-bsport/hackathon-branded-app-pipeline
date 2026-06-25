import type { FC } from "react";

import type { SavedPaymentMethod } from "@bsport/api-financial-services/payment-method";
import { Body, Card } from "@bsport/kaizen-primitive-core";

import PaymentMethodChip from "#src/components/financial-services/payment-method-chip";
import PaymentMethodLogo from "#src/components/financial-services/payment-method-logo";
import { i18nInstance, useTranslation } from "#src/i18n";

import { getSavedPaymentMethodDisplay } from "./helpers";

type Props = {
  paymentMethod: SavedPaymentMethod;
};

/**
 * Read-only summary card for a saved payment method.
 *
 * Renders a Card with the method's logo, masked identifier, type chip, and
 * expiry date (for card methods). Derives all display values from
 * `getSavedPaymentMethodDisplay` so consumers pass only the raw API object.
 */
export const PaymentMethodCard: FC<Props> = ({ paymentMethod }) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const display = getSavedPaymentMethodDisplay(paymentMethod);
  const maskedIdentifier =
    display.maskedIdentifier || t("paymentMethod.display.unknownIdentifier");

  return (
    <Card>
      <div className="flex w-full items-center gap-xs">
        {display.logoType && (
          <PaymentMethodLogo size="md" type={display.logoType} />
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-0">
          <Body size="lg" weight="strong">
            {maskedIdentifier}
          </Body>

          {display.expiry && (
            <Body color="weak" size="sm">
              {t("paymentMethod.display.expires", { date: display.expiry })}
            </Body>
          )}
        </div>

        <PaymentMethodChip type={paymentMethod.type} />
      </div>
    </Card>
  );
};

PaymentMethodCard.displayName = "KaizenPaymentMethodCard";
