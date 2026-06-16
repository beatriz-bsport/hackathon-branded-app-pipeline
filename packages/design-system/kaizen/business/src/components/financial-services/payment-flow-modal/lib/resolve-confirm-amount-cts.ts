import type { PaymentFlowGiftCard } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/gift-card/types";
import {
  PAYMENT_TAB,
  type PaymentTab,
} from "#src/components/financial-services/payment-flow-modal/lib/payment-flow-form";
import { ALL_PAYMENT_METHOD_SELECTOR_ID } from "#src/components/financial-services/payment-method-selector/constants";
import type { PaymentMethodSelectorSelection } from "#src/components/financial-services/payment-method-selector/types";
import { PAYMENT_METHOD_SELECTOR_SELECTION_KIND } from "#src/components/financial-services/payment-method-selector/types";

type ResolveConfirmAmountCtsParams = {
  activeTab: PaymentTab;
  dueAmountCts: number;
  selectedPaymentMethod: PaymentMethodSelectorSelection;
  accountBalance: number;
  selectedGiftCard: PaymentFlowGiftCard | null;
  clientSecretPriceCts?: number;
};

export const resolveConfirmAmountCts = ({
  activeTab,
  dueAmountCts,
  selectedPaymentMethod,
  accountBalance,
  selectedGiftCard,
  clientSecretPriceCts,
}: ResolveConfirmAmountCtsParams): number => {
  if (activeTab === PAYMENT_TAB.INSTALLMENTS) return 0;

  const methodId =
    selectedPaymentMethod?.kind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL
      ? selectedPaymentMethod.id
      : null;

  if (methodId === ALL_PAYMENT_METHOD_SELECTOR_ID.ACCOUNT_BALANCE) {
    return Math.min(Math.round(accountBalance * 100), dueAmountCts);
  }

  if (
    methodId === ALL_PAYMENT_METHOD_SELECTOR_ID.GIFT_CARD_CODE &&
    selectedGiftCard
  ) {
    return Math.min(
      Math.round(selectedGiftCard.availableAmount * 100),
      dueAmountCts,
    );
  }

  return clientSecretPriceCts && clientSecretPriceCts > 0
    ? clientSecretPriceCts
    : dueAmountCts;
};
