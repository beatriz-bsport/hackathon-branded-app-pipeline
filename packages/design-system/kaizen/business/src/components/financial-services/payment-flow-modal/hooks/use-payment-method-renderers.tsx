import type { ReactNode, RefObject } from "react";

import type { Fetch } from "@bsport/fetch";
import type { UseFormControllerOutput } from "@bsport/form";

import type { PaymentMethodSelectorSelection } from "#src/components/financial-services/payment-method-selector/types";

import type { AllPaymentMethodKey } from "../../payment-method-selector/constants";
import { paymentFlowFormSchema } from "../payment-flow-form";
import { GiftCardPaymentMethod } from "../payment-methods/gift-card/gift-card-payment-method";
import type { PaymentFlowGiftCard } from "../payment-methods/gift-card/types";
import { ManualPaymentMethod } from "../payment-methods/manual/manual-payment-method";
import { StripePaymentMethod } from "../payment-methods/stripe/stripe-payment-method";
import type { StripePaymentMethodHandle } from "../payment-methods/stripe/types";
import { TerminalPaymentMethod } from "../payment-methods/terminal/terminal-payment-method";
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
}: UsePaymentMethodRenderersParams) => {
  const savePaymentMethod = methods.watch("savePaymentMethod");
  const terminalReaderId = methods.watch("terminalReaderId");
  const selectedGiftCardId = methods.watch("selectedGiftCardId");
  const manualType = methods.watch("manualType");
  const manualDate = methods.watch("manualDate");
  const manualNote = methods.watch("manualNote");

  const hiddenAllMethodIds: AllPaymentMethodKey[] = [];
  if (!hasPositiveAccountBalance) hiddenAllMethodIds.push("account_balance");
  if (isLoadingStripeReaders || !hasStripeReaders)
    hiddenAllMethodIds.push("terminal");

  const allMethodRenderers: Record<AllPaymentMethodKey, () => ReactNode> = {
    card: () =>
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
        />
      ) : null,
    sepa_debit: () =>
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
        />
      ) : null,
    gift_card_code: () => (
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
    account_balance: () => null,
    terminal: () => (
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
    manual: () => (
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
    if (selectedPaymentMethod?.kind !== "all") return null;
    return allMethodRenderers[selectedPaymentMethod.id]?.() ?? null;
  };

  return {
    hiddenAllMethodIds,
    renderSelectedPaymentMethod,
  };
};
