import { useEffect, useId, useMemo, useRef, useState } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { useFormController } from "@bsport/form";

import type { PaymentMethodSelectorSelection } from "#src/components/financial-services/payment-method-selector/types";
import { i18nInstance, useTranslation } from "#src/i18n";

import {
  INVOICE_ALREADY_PAID_ALERT,
  getPaymentFlowDefaultValues,
  paymentFlowFormSchema,
} from "../payment-flow-form";
import type { PaymentFlowGiftCard } from "../payment-methods/gift-card/types";
import { STRIPE_ELEMENT_VALIDATION_ERROR } from "../payment-methods/stripe/constants";
import type { StripePaymentMethodHandle } from "../payment-methods/stripe/types";
import type {
  PaymentFlowModalBodyState,
  PaymentFlowModalProps,
} from "../types";
import { useConfirmPayment } from "./use-confirm-payment";
import { useFetchInvoice } from "./use-fetch-invoice";
import { useFetchMember } from "./use-fetch-member";
import { useFetchStripeReaders } from "./use-fetch-stripe-readers";
import { usePaymentMethodRenderers } from "./use-payment-method-renderers";
import { useRequestPaymentClientSecret } from "./use-request-payment-client-secret";

type PaymentClientSecretEngine = "stripe" | "manual" | "terminal";

/**
 * Resolves which backend engine must generate the payment client secret for
 * the current selector value.
 */
const getPaymentClientSecretEngine = (
  selection: PaymentMethodSelectorSelection,
): PaymentClientSecretEngine | null => {
  if (!selection) return null;

  // Saved payment methods are always handled by Stripe.
  if (selection.kind === "saved") return "stripe";

  // New payment methods are handled by the appropriate engine.
  if (selection.id === "card" || selection.id === "sepa_debit") return "stripe";
  if (selection.id === "manual") return "manual";
  if (selection.id === "terminal") return "terminal";

  return null;
};

const SUBMIT_ERROR_FALLBACK = "paymentFlowModal.errors.generic";
const GIFT_CARD_PAYMENT_ERROR_CODE = 45001;

/**
 * Maps mutation errors to the translated message displayed in the modal.
 */
const resolveSubmitErrorMessage = (
  error: unknown,
  fallbackMessage: string,
  giftCardPaymentMessage: string,
): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "customErrorCodes" in error &&
    Array.isArray(error.customErrorCodes)
  ) {
    const firstErrorCode = error.customErrorCodes[0];

    if (firstErrorCode === GIFT_CARD_PAYMENT_ERROR_CODE) {
      return giftCardPaymentMessage;
    }
  }

  return fallbackMessage;
};

/**
 * Central state and orchestration hook for `PaymentFlowModal`.
 *
 * Responsibilities:
 * - fetches invoice/member/reader data used by the modal;
 * - derives remaining amount and payment capability flags;
 * - coordinates payment client-secret lifecycle based on selected method;
 * - exposes submission state and UI-ready body props.
 */
export const usePaymentFlowModalState = ({
  isOpen,
  invoiceId,
  memberId,
  fetch,
  onClose,
  onConfirm,
}: PaymentFlowModalProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });

  const [activeTab, setActiveTab] = useState<"one-time" | "installments">(
    "one-time",
  );
  const [isPartialEnabled, setIsPartialEnabled] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodSelectorSelection>(null);
  const [clientSecretEngine, setClientSecretEngine] =
    useState<PaymentClientSecretEngine | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [availableGiftCards, setAvailableGiftCards] = useState<
    PaymentFlowGiftCard[]
  >([]);
  const formId = `payment-flow-modal-${useId()}`;
  const cardPaymentRef = useRef<StripePaymentMethodHandle>(null);
  const sepaPaymentRef = useRef<StripePaymentMethodHandle>(null);
  const methods = useFormController({
    schema: paymentFlowFormSchema,
    defaultValues: getPaymentFlowDefaultValues(),
  });

  const { data: member } = useFetchMember(fetch, memberId);
  const { data: invoice, isLoading: isLoadingInvoice } = useFetchInvoice(
    fetch,
    invoiceId,
  );
  const { data: stripeReaders = [], isLoading: isLoadingStripeReaders } =
    useFetchStripeReaders({ fetch, enabled: isOpen });

  const invoicePriceDueFromTotal = Number(invoice?.price_due);
  const invoiceAmountDueCts = Number(invoice?.amount_due_cts);
  const invoiceAmountPaidCts = Number(invoice?.amount_paid_cts);
  const invoiceRemainingAmount = Number.isFinite(invoiceAmountDueCts)
    ? Math.max((invoiceAmountDueCts - invoiceAmountPaidCts) / 100, 0)
    : invoicePriceDueFromTotal;
  const isInvoiceAlreadyPaid =
    Number.isFinite(invoiceRemainingAmount) && invoiceRemainingAmount <= 0;

  useEffect(() => {
    const nextEngine = getPaymentClientSecretEngine(selectedPaymentMethod);
    if (nextEngine === clientSecretEngine) return;

    setClientSecretEngine(nextEngine);
  }, [clientSecretEngine, selectedPaymentMethod]);

  const paymentClientSecretQuery = useRequestPaymentClientSecret({
    fetch,
    invoiceId,
    paymentEngine: clientSecretEngine,
    enabled:
      isOpen &&
      !isLoadingInvoice &&
      !isInvoiceAlreadyPaid &&
      invoiceId.length > 0 &&
      clientSecretEngine !== null,
  });

  const accountBalance = Number(member?.credit_account_balance);
  const hasPositiveAccountBalance = accountBalance > 0;
  const isAccountBalanceEnough =
    hasPositiveAccountBalance && accountBalance >= invoiceRemainingAmount;
  const hasStripeReaders = stripeReaders.length > 0;

  const renderers = usePaymentMethodRenderers({
    fetch,
    memberId,
    methods,
    selectedPaymentMethod,
    member,
    paymentClientSecret: paymentClientSecretQuery.data?.client_secret,
    paymentAmountCts: paymentClientSecretQuery.data?.price_cts,
    isLoadingPaymentClientSecret: paymentClientSecretQuery.isFetching,
    stripeReaders,
    isLoadingStripeReaders,
    hasPositiveAccountBalance,
    hasStripeReaders,
    cardPaymentRef,
    sepaPaymentRef,
    onGiftCardsChange: setAvailableGiftCards,
  });

  const confirmPaymentMutation = useConfirmPayment({
    fetch,
    invoiceId,
    memberId,
    invoiceRemainingAmount,
    isInvoiceAlreadyPaid,
    selectedPaymentMethod,
    paymentClientSecret: paymentClientSecretQuery.data ?? {},
    getFormValues: () => ({
      savePaymentMethod: methods.getValues("savePaymentMethod"),
      terminalReaderId: methods.getValues("terminalReaderId"),
      selectedGiftCardId: methods.getValues("selectedGiftCardId"),
      manualType: methods.getValues("manualType"),
      manualDate: methods.getValues("manualDate"),
      manualNote: methods.getValues("manualNote"),
    }),
    availableGiftCards,
    cardPaymentRef,
    sepaPaymentRef,
    invoiceAlreadyPaidAlert: INVOICE_ALREADY_PAID_ALERT,
  });

  const terminalReaderId = methods.watch("terminalReaderId");
  const selectedGiftCardId = methods.watch("selectedGiftCardId");

  const isConfirmDisabled = useMemo(() => {
    if (
      isInvoiceAlreadyPaid ||
      !selectedPaymentMethod ||
      confirmPaymentMutation.isPending
    ) {
      return true;
    }

    const selectedMethodNeedsClientSecret =
      getPaymentClientSecretEngine(selectedPaymentMethod) !== null;

    if (
      selectedMethodNeedsClientSecret &&
      (paymentClientSecretQuery.isFetching ||
        !paymentClientSecretQuery.data?.client_secret)
    ) {
      return true;
    }

    if (selectedPaymentMethod.kind !== "all") return false;

    if (
      selectedPaymentMethod.id === "terminal" &&
      (!terminalReaderId || isLoadingStripeReaders)
    ) {
      return true;
    }
    if (selectedPaymentMethod.id === "gift_card_code" && !selectedGiftCardId) {
      return true;
    }

    return false;
  }, [
    confirmPaymentMutation.isPending,
    isInvoiceAlreadyPaid,
    isLoadingStripeReaders,
    paymentClientSecretQuery.data?.client_secret,
    paymentClientSecretQuery.isFetching,
    selectedPaymentMethod,
    selectedGiftCardId,
    terminalReaderId,
  ]);

  const isConfirmLoading = useMemo(() => {
    if (confirmPaymentMutation.isPending) return true;

    if (!selectedPaymentMethod || isInvoiceAlreadyPaid) return false;

    const selectedMethodNeedsClientSecret =
      getPaymentClientSecretEngine(selectedPaymentMethod) !== null;
    const isBlockedByClientSecretLoading =
      selectedMethodNeedsClientSecret && paymentClientSecretQuery.isFetching;

    if (selectedPaymentMethod.kind !== "all") {
      return isBlockedByClientSecretLoading;
    }

    const hasNonLoadingBlocker =
      (selectedPaymentMethod.id === "terminal" && !terminalReaderId) ||
      (selectedPaymentMethod.id === "gift_card_code" && !selectedGiftCardId);

    if (hasNonLoadingBlocker) return false;

    const isBlockedByTerminalLoading =
      selectedPaymentMethod.id === "terminal" && isLoadingStripeReaders;

    return isBlockedByClientSecretLoading || isBlockedByTerminalLoading;
  }, [
    confirmPaymentMutation.isPending,
    isInvoiceAlreadyPaid,
    isLoadingStripeReaders,
    paymentClientSecretQuery.isFetching,
    selectedGiftCardId,
    selectedPaymentMethod,
    terminalReaderId,
  ]);

  const handleSubmit = () => {
    setSubmitError(null);
    confirmPaymentMutation.mutate(undefined, {
      onSuccess: () => {
        onConfirm?.();
        onClose();
      },
      onError: (error: unknown) => {
        const isStripeValidationError =
          error instanceof Error &&
          error.message === STRIPE_ELEMENT_VALIDATION_ERROR;
        if (isStripeValidationError) {
          setSubmitError(null);
          return;
        }

        setSubmitError(
          resolveSubmitErrorMessage(
            error,
            t(SUBMIT_ERROR_FALLBACK),
            t("paymentFlowModal.errors.giftCardPayment"),
          ),
        );
      },
    });
  };

  const amountToPay = Number.isNaN(invoiceRemainingAmount)
    ? "--"
    : getCurrencyDisplayWithPrice(invoiceRemainingAmount);

  const shouldShowMemberBalanceWarning =
    selectedPaymentMethod?.kind === "all" &&
    selectedPaymentMethod.id === "account_balance" &&
    hasPositiveAccountBalance &&
    !isAccountBalanceEnough;

  const body: PaymentFlowModalBodyState = {
    memberId,
    fetch,
    activeTab,
    setActiveTab,
    isPartialEnabled,
    setIsPartialEnabled,
    amountToPay,
    isInvoiceAlreadyPaid,
    shouldShowMemberBalanceWarning,
    submitError,
    hasPositiveAccountBalance,
    isAccountBalanceEnough,
    accountBalance,
    hiddenAllMethodIds: renderers.hiddenAllMethodIds,
    onSelectionChange: setSelectedPaymentMethod,
    renderSelectedPaymentMethod: renderers.renderSelectedPaymentMethod,
    memberName: member?.name ?? `#${memberId}`,
    invoiceUrl: `/invoice/${invoiceId}`,
    memberUrl: `/member/${memberId}`,
  };

  return {
    methods,
    formId,
    handleSubmit,
    isConfirmDisabled,
    isConfirmLoading,
    body,
  };
};
