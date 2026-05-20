import type { ReactNode, RefObject } from "react";

import type { CompanyTheme } from "@bsport/api-core";
import type { Fetch } from "@bsport/fetch";
import type { UseFormControllerOutput } from "@bsport/form";

import { GiftCardPaymentMethod } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/gift-card/gift-card-payment-method";
import type { PaymentFlowGiftCard } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/gift-card/types";
import { ManualPaymentMethod } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/manual/manual-payment-method";
import { StripePaymentMethod } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/stripe/stripe-payment-method";
import type { StripePaymentMethodHandle } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/stripe/types";
import { TerminalPaymentMethod } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/terminal/terminal-payment-method";
import { paymentFlowFormSchema } from "#src/components/financial-services/payment-flow-modal/lib/payment-flow-form";
import {
  ALL_PAYMENT_METHOD_SELECTOR_ID,
  type AllPaymentMethodKey,
} from "#src/components/financial-services/payment-method-selector/constants";
import {
  PAYMENT_METHOD_SELECTOR_SELECTION_KIND,
  type PaymentMethodSelectorSelection,
} from "#src/components/financial-services/payment-method-selector/types";

import type { StripeReader } from "./use-fetch-stripe-readers";

type PaymentFlowFormController = Pick<
  UseFormControllerOutput<typeof paymentFlowFormSchema>,
  "watch" | "setValue"
>;

type UsePaymentMethodRenderersParams = {
  fetch: Fetch;
  memberId: number;
  methods: PaymentFlowFormController;
  selectedPaymentMethod: PaymentMethodSelectorSelection;
  member:
    | {
        id: number;
        name: string;
        email: string;
      }
    | undefined;
  paymentClientSecret?: string;
  paymentAmountCts?: number;
  isLoadingPaymentClientSecret: boolean;
  stripeReaders: StripeReader[];
  isLoadingStripeReaders: boolean;
  hasPositiveAccountBalance: boolean;
  hasStripeReaders: boolean;
  cardPaymentRef: RefObject<StripePaymentMethodHandle | null>;
  sepaPaymentRef: RefObject<StripePaymentMethodHandle | null>;
  onGiftCardsChange: (cards: PaymentFlowGiftCard[]) => void;
  companyTheme?: CompanyTheme;
};

/**
 * Resolves UI renderers for each payment method shown in the modal.
 *
 * This hook acts as a small composition layer that:
 * - binds form state to method-specific components;
 * - computes which "all methods" options should be hidden based on runtime
 *   capabilities (balance, terminal readers);
 * - returns a render function for the currently selected "all" method.
 */
export const usePaymentMethodRenderers = ({
  fetch,
  memberId,
  methods,
  selectedPaymentMethod,
  member,
  paymentClientSecret,
  paymentAmountCts,
  isLoadingPaymentClientSecret,
  stripeReaders,
  isLoadingStripeReaders,
  hasPositiveAccountBalance,
  hasStripeReaders,
  cardPaymentRef,
  sepaPaymentRef,
  onGiftCardsChange,
  companyTheme,
}: UsePaymentMethodRenderersParams) => {
  const savePaymentMethod = methods.watch("savePaymentMethod");
  const terminalReaderId = methods.watch("terminalReaderId");
  const selectedGiftCardId = methods.watch("selectedGiftCardId");
  const manualType = methods.watch("manualType");
  const manualDate = methods.watch("manualDate");
  const manualNote = methods.watch("manualNote");

  const hiddenAllMethodIds: AllPaymentMethodKey[] = [];
  if (!hasPositiveAccountBalance)
    hiddenAllMethodIds.push(ALL_PAYMENT_METHOD_SELECTOR_ID.ACCOUNT_BALANCE);
  if (isLoadingStripeReaders || !hasStripeReaders)
    hiddenAllMethodIds.push(ALL_PAYMENT_METHOD_SELECTOR_ID.TERMINAL);

  const allMethodRenderers: Record<AllPaymentMethodKey, () => ReactNode> = {
    [ALL_PAYMENT_METHOD_SELECTOR_ID.CARD]: () =>
      member ? (
        <StripePaymentMethod
          ref={cardPaymentRef}
          member={member}
          method="card"
          amountCts={paymentAmountCts ?? 0}
          clientSecret={paymentClientSecret}
          isClientSecretLoading={isLoadingPaymentClientSecret}
          savePaymentMethod={savePaymentMethod}
          onSavePaymentMethodChange={(value) =>
            methods.setValue("savePaymentMethod", value)
          }
          companyTheme={companyTheme}
        />
      ) : null,
    [ALL_PAYMENT_METHOD_SELECTOR_ID.SEPA_DEBIT]: () =>
      member ? (
        <StripePaymentMethod
          ref={sepaPaymentRef}
          member={member}
          method="sepa_debit"
          amountCts={paymentAmountCts ?? 0}
          clientSecret={paymentClientSecret}
          isClientSecretLoading={isLoadingPaymentClientSecret}
          savePaymentMethod={savePaymentMethod}
          onSavePaymentMethodChange={(value) =>
            methods.setValue("savePaymentMethod", value)
          }
          companyTheme={companyTheme}
        />
      ) : null,
    [ALL_PAYMENT_METHOD_SELECTOR_ID.GIFT_CARD_CODE]: () => (
      <GiftCardPaymentMethod
        fetch={fetch}
        memberId={memberId}
        selectedGiftCardId={selectedGiftCardId}
        onSelectedGiftCardIdChange={(value) =>
          methods.setValue("selectedGiftCardId", value)
        }
        onGiftCardsChange={onGiftCardsChange}
      />
    ),
    [ALL_PAYMENT_METHOD_SELECTOR_ID.ACCOUNT_BALANCE]: () => null,
    [ALL_PAYMENT_METHOD_SELECTOR_ID.TERMINAL]: () => (
      <TerminalPaymentMethod
        stripeReaders={stripeReaders}
        isLoading={isLoadingStripeReaders}
        selectedReaderId={terminalReaderId}
        onSelectedReaderIdChange={(value) =>
          methods.setValue("terminalReaderId", value)
        }
        savePaymentMethod={savePaymentMethod}
        onSavePaymentMethodChange={(value) =>
          methods.setValue("savePaymentMethod", value)
        }
      />
    ),
    [ALL_PAYMENT_METHOD_SELECTOR_ID.MANUAL]: () => (
      <ManualPaymentMethod
        manualType={manualType}
        paymentDate={manualDate}
        note={manualNote}
        onManualTypeChange={(value) => methods.setValue("manualType", value)}
        onPaymentDateChange={(value) => methods.setValue("manualDate", value)}
        onNoteChange={(value) => methods.setValue("manualNote", value)}
      />
    ),
  };

  const renderSelectedPaymentMethod = (): ReactNode => {
    if (
      selectedPaymentMethod?.kind !== PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL
    )
      return null;
    return allMethodRenderers[selectedPaymentMethod.id]?.() ?? null;
  };

  return {
    hiddenAllMethodIds,
    renderSelectedPaymentMethod,
  };
};
