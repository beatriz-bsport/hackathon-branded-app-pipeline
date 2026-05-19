import type { ReactNode } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { Body, Card, Title } from "@bsport/kaizen-primitive-core";

import type { PaymentFlowModalProps } from "#src/components/financial-services/payment-flow-modal/types";
import { PaymentMethodSelector } from "#src/components/financial-services/payment-method-selector";
import {
  ALL_PAYMENT_METHOD_SELECTOR_ID,
  type AllPaymentMethodKey,
} from "#src/components/financial-services/payment-method-selector/constants";
import type { PaymentMethodSelectorSelection } from "#src/components/financial-services/payment-method-selector/types";
import { i18nInstance, useTranslation } from "#src/i18n";

type PaymentMethodSectionProps = Pick<
  PaymentFlowModalProps,
  "memberId" | "fetch"
> & {
  disabled: boolean;
  hasPositiveAccountBalance: boolean;
  isAccountBalanceEnough: boolean;
  accountBalance: number;
  hiddenAllMethodIds: AllPaymentMethodKey[];
  disabledAllMethodIds: AllPaymentMethodKey[];
  onSelectionChange: (selection: PaymentMethodSelectorSelection) => void;
  renderSelectedPaymentMethod: () => ReactNode;
};

export const PaymentMethodSection = ({
  memberId,
  fetch,
  disabled,
  hasPositiveAccountBalance,
  isAccountBalanceEnough,
  accountBalance,
  hiddenAllMethodIds,
  disabledAllMethodIds,
  onSelectionChange,
  renderSelectedPaymentMethod,
}: PaymentMethodSectionProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });

  return (
    <Card className="flex flex-col gap-md bg-surface-default-weaker">
      <div className="flex flex-col gap-xs">
        <Title htmlVariant="h3" color="default" weight="strong">
          {t("paymentFlowModal.paymentMethodTitle")}
        </Title>

        <PaymentMethodSelector
          memberId={memberId}
          fetch={fetch}
          label={undefined}
          size="md"
          disabled={disabled}
          allMethodsConfig={{
            hiddenIds:
              hiddenAllMethodIds.length > 0 ? hiddenAllMethodIds : undefined,
            disabledIds:
              disabledAllMethodIds.length > 0
                ? disabledAllMethodIds
                : undefined,
            adornmentById: {
              [ALL_PAYMENT_METHOD_SELECTOR_ID.ACCOUNT_BALANCE]:
                hasPositiveAccountBalance ? (
                  <Body
                    htmlVariant="span"
                    size="lg"
                    color={isAccountBalanceEnough ? undefined : "warning"}
                    className={
                      isAccountBalanceEnough
                        ? "text-onsurface-status-positive-strong"
                        : undefined
                    }
                  >
                    {getCurrencyDisplayWithPrice(accountBalance)}
                  </Body>
                ) : undefined,
            },
          }}
          onSelectionChange={onSelectionChange}
        />
      </div>

      {renderSelectedPaymentMethod()}
    </Card>
  );
};
