import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchInvoiceAPI,
  invoiceKeys,
} from "@bsport/api-financial-services/invoice";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { toast } from "@bsport/kaizen-primitive-core";

import type { CheckoutFlowFormData } from "#src/components/core/checkout-flow-modal/types";
import { useCheckoutFlowStep } from "#src/components/core/checkout-flow-modal/use-checkout-flow-step";
import { usePaymentFlowModalState } from "#src/components/financial-services/payment-flow-modal/hooks/use-payment-flow-modal-state";
import { i18nInstance, useTranslation } from "#src/i18n";
import { useGuardedModalClose } from "#src/utils/use-guarded-modal-close";

import { CHECKOUT_PAYMENT_FLOW_MODE } from "./constants";
import {
  INVOICE_CREATED_FLOW_ACTION,
  getInitialCheckoutPaymentFlowPhase,
  resolveInvoiceCreatedFlowAction,
} from "./lib/checkout-payment-flow-phase";
import {
  CHECKOUT_PAYMENT_FLOW_PHASE,
  type CheckoutPaymentFlowModalProps,
  type CheckoutPaymentFlowPhase,
} from "./types";

type UseCheckoutPaymentFlowStateParams = CheckoutPaymentFlowModalProps;
type CheckoutStepState = ReturnType<typeof useCheckoutFlowStep>;
type PaymentStepState = ReturnType<typeof usePaymentFlowModalState>;

const TRAILING_ZERO_CURRENCY_REGEX = /([,.]00)(?=\s?[^\d\s]+$)/;

const stripCurrencyTrailingZeros = (value: string) =>
  value.replace(TRAILING_ZERO_CURRENCY_REGEX, "");

type PartialSuccessState = {
  isOpen: boolean;
  remainingAmountLabel: string;
  onClose: () => void;
  onCloseButtonClick: () => void;
  onPayRemainingAmount: () => Promise<void>;
};

type SharedCheckoutPaymentFlowState = {
  modalTitle: string;
  isMainModalOpen: boolean;
  onCloseButtonClick: () => void;
  onClickOutside: () => void;
  partialSuccess: PartialSuccessState;
};

type CheckoutPhaseState = SharedCheckoutPaymentFlowState & {
  phase: typeof CHECKOUT_PAYMENT_FLOW_PHASE.CHECKOUT;
  isCheckoutPhase: true;
  isPaymentStepActive: false;
  checkoutStep: CheckoutStepState;
  footer: {
    confirmButton: {
      color: "main";
      label: string;
      type: "submit";
      form: string;
      disabled: boolean;
    };
    cancelButton: {
      label: string;
      onClick: () => void;
    };
  };
};

type PaymentPhaseState = SharedCheckoutPaymentFlowState & {
  phase: typeof CHECKOUT_PAYMENT_FLOW_PHASE.PAYMENT;
  isCheckoutPhase: false;
  isPaymentStepActive: boolean;
  paymentStep: PaymentStepState;
  footer: {
    confirmButton: {
      label: string;
      color: "main";
      type: "submit";
      form: string;
      disabled: boolean;
      loading: boolean;
    };
    cancelButton: {
      label: string;
      onClick: () => void;
    };
  } | null;
};

export type CheckoutPaymentFlowState = CheckoutPhaseState | PaymentPhaseState;

export const useCheckoutPaymentFlowState = ({
  isOpen,
  mode,
  companyId,
  fetch,
  memberId: memberIdProp,
  invoiceId: invoiceIdProp,
  onClose,
  onCheckoutComplete,
  onPaymentConfirm,
  onTransitionToPayment,
  onError,
  onTrack,
  startContext,
  basketSessionId,
  companyTheme,
}: UseCheckoutPaymentFlowStateParams): CheckoutPaymentFlowState => {
  const { t: tCore } = useTranslation("core", { i18n: i18nInstance });
  const { t: tFS } = useTranslation("financial-services", {
    i18n: i18nInstance,
  });
  const queryClient = useQueryClient();

  const [phase, setPhase] = useState<CheckoutPaymentFlowPhase>(() =>
    getInitialCheckoutPaymentFlowPhase(mode),
  );
  const [sessionInvoiceId, setSessionInvoiceId] = useState<string | null>(null);
  const [sessionMemberId, setSessionMemberId] = useState<number | null>(null);

  const [isPartialSuccessOpen, setIsPartialSuccessOpen] = useState(false);
  const [isPaymentInternalOpen, setIsPaymentInternalOpen] = useState(false);
  const [
    shouldDismissFlowOnPartialSuccessClose,
    setShouldDismissFlowOnPartialSuccessClose,
  ] = useState(true);
  const [hasInitializedModeEffect, setHasInitializedModeEffect] =
    useState(false);
  const [
    partialSuccessRemainingAmountCts,
    setPartialSuccessRemainingAmountCts,
  ] = useState(0);

  const resetFlowSession = useCallback(() => {
    setPhase(getInitialCheckoutPaymentFlowPhase(mode));
    setSessionInvoiceId(null);
    setSessionMemberId(null);
    setIsPartialSuccessOpen(false);
    setIsPaymentInternalOpen(false);
    setShouldDismissFlowOnPartialSuccessClose(true);
    setPartialSuccessRemainingAmountCts(0);
  }, [mode]);

  useEffect(() => {
    if (!isOpen) {
      resetFlowSession();
    }
  }, [isOpen, resetFlowSession]);

  useEffect(() => {
    if (!hasInitializedModeEffect) {
      setHasInitializedModeEffect(true);
      return;
    }
    resetFlowSession();
  }, [hasInitializedModeEffect, mode, resetFlowSession]);

  const isCheckoutPhase = phase === CHECKOUT_PAYMENT_FLOW_PHASE.CHECKOUT;
  const isPaymentPhase = phase === CHECKOUT_PAYMENT_FLOW_PHASE.PAYMENT;

  const resolvedInvoiceId = sessionInvoiceId ?? invoiceIdProp ?? null;
  const resolvedMemberId = sessionMemberId ?? memberIdProp ?? null;

  useEffect(() => {
    if (
      !isOpen ||
      mode !== CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT ||
      (resolvedInvoiceId != null && resolvedMemberId != null)
    ) {
      return;
    }

    onError?.(
      new Error(
        "CheckoutPaymentFlowModal requires both invoiceId and memberId in payment mode",
      ),
    );
    onClose();
  }, [isOpen, mode, resolvedInvoiceId, resolvedMemberId, onError, onClose]);

  const handleInvoiceCreated = useCallback(
    (invoiceUuid: string, memberId: number, data: CheckoutFlowFormData) => {
      const action = resolveInvoiceCreatedFlowAction(
        mode,
        invoiceUuid,
        memberId,
      );

      if (action.type === INVOICE_CREATED_FLOW_ACTION.TRANSITION_TO_PAYMENT) {
        setSessionInvoiceId(action.invoiceId);
        setSessionMemberId(action.memberId);
        setPhase(CHECKOUT_PAYMENT_FLOW_PHASE.PAYMENT);
        onTransitionToPayment?.(action.invoiceId, action.memberId);
        return;
      }

      onCheckoutComplete?.(data, invoiceUuid);
    },
    [mode, onCheckoutComplete, onTransitionToPayment],
  );

  const checkoutStep = useCheckoutFlowStep({
    companyId,
    fetch,
    isActive: isOpen && isCheckoutPhase,
    memberId: memberIdProp,
    onClose,
    onError,
    onInvoiceCreated: handleInvoiceCreated,
    onTrack,
    startContext,
    basketSessionId,
  });

  const isPaymentStepActive =
    isOpen &&
    isPaymentPhase &&
    resolvedInvoiceId != null &&
    resolvedMemberId != null;

  const paymentStep = usePaymentFlowModalState({
    isOpen: isPaymentStepActive || isPaymentInternalOpen,
    invoiceId: resolvedInvoiceId ?? "",
    memberId: resolvedMemberId ?? 0,
    fetch,
    onClose: () => {
      setIsPaymentInternalOpen(false);
      onClose();
    },
    onConfirm: (remainingAmountCts) => {
      onPaymentConfirm?.(remainingAmountCts);
      if (remainingAmountCts > 0) {
        setShouldDismissFlowOnPartialSuccessClose(true);
        setPartialSuccessRemainingAmountCts(remainingAmountCts);
        setIsPartialSuccessOpen(true);
      }
    },
    companyTheme,
  });

  const paymentConfirmLabel = useMemo(() => {
    const { confirmAmountCts } = paymentStep;
    if (confirmAmountCts <= 0) {
      return tFS("paymentFlowModal.buttons.confirm");
    }
    const price = stripCurrencyTrailingZeros(
      getCurrencyDisplayWithPrice(confirmAmountCts / 100),
    );
    return tFS("paymentFlowModal.buttons.pay", { amount: price });
  }, [paymentStep, tFS]);

  const modalTitle = isCheckoutPhase
    ? tCore("checkoutFlowModal.title")
    : tFS("paymentFlowModal.title");

  const isMainModalOpen =
    isOpen &&
    !isPartialSuccessOpen &&
    (isCheckoutPhase || isPaymentStepActive || isPaymentInternalOpen);

  const paymentCloseHandlers = useGuardedModalClose({
    skipEscapeListener: !isMainModalOpen,
    shouldGuard: false,
    close: paymentStep.closeModal,
  });

  const checkoutFooter = {
    confirmButton: {
      color: "main" as const,
      label: tCore("checkoutFlowModal.title"),
      type: "submit" as const,
      form: checkoutStep.formId,
      disabled: checkoutStep.isConfirmDisabled,
    },
    cancelButton: {
      label: tCore("checkoutFlowModal.cancel"),
      onClick: checkoutStep.handleCancelClose,
    },
  };

  const paymentFooter = isPaymentStepActive
    ? {
        confirmButton: {
          label: paymentConfirmLabel,
          color: "main" as const,
          type: "submit" as const,
          form: paymentStep.formId,
          disabled: paymentStep.isConfirmDisabled,
          loading: paymentStep.isConfirmLoading,
        },
        cancelButton: {
          label: tFS("paymentFlowModal.buttons.cancel"),
          onClick: paymentCloseHandlers.handleCancelClose,
        },
      }
    : null;

  const remainingAmountLabel = stripCurrencyTrailingZeros(
    getCurrencyDisplayWithPrice(partialSuccessRemainingAmountCts / 100),
  );

  const closePartialSuccessModal = useCallback(
    ({
      dismissFlowOnTransitionEnd = true,
    }: {
      dismissFlowOnTransitionEnd?: boolean;
    } = {}) => {
      setShouldDismissFlowOnPartialSuccessClose(dismissFlowOnTransitionEnd);
      setIsPartialSuccessOpen(false);
      setPartialSuccessRemainingAmountCts(0);
    },
    [],
  );

  const dismissPartialSuccessFlow = useCallback(() => {
    setShouldDismissFlowOnPartialSuccessClose(false);
    setIsPartialSuccessOpen(false);
    setPartialSuccessRemainingAmountCts(0);
    setIsPaymentInternalOpen(false);
    onClose();
  }, [onClose]);

  const handlePartialSuccessClose = useCallback(() => {
    if (!shouldDismissFlowOnPartialSuccessClose) {
      return;
    }
    dismissPartialSuccessFlow();
  }, [dismissPartialSuccessFlow, shouldDismissFlowOnPartialSuccessClose]);

  const handlePayRemainingAmount = useCallback(async () => {
    if (resolvedInvoiceId == null) return;

    try {
      const freshInvoice = await fetchInvoiceAPI(fetch, resolvedInvoiceId);
      queryClient.setQueryData(
        invoiceKeys.detail(resolvedInvoiceId),
        freshInvoice,
      );
      closePartialSuccessModal({ dismissFlowOnTransitionEnd: false });
      setIsPaymentInternalOpen(true);
    } catch (error: unknown) {
      onError?.(
        error instanceof Error
          ? error
          : new Error("Failed to reload invoice before reopening payment flow"),
      );
      toast({
        status: "critical",
        title: tFS("paymentFlowModal.errors.generic"),
        icon: "alert-circle",
      });
    }
  }, [
    closePartialSuccessModal,
    fetch,
    onError,
    queryClient,
    resolvedInvoiceId,
    tFS,
  ]);

  const partialSuccess = {
    isOpen: isPartialSuccessOpen,
    remainingAmountLabel,
    onClose: handlePartialSuccessClose,
    onCloseButtonClick: dismissPartialSuccessFlow,
    onPayRemainingAmount: handlePayRemainingAmount,
  };

  if (isCheckoutPhase) {
    return {
      phase: CHECKOUT_PAYMENT_FLOW_PHASE.CHECKOUT,
      isCheckoutPhase: true,
      isPaymentStepActive: false,
      checkoutStep,
      modalTitle,
      isMainModalOpen,
      footer: checkoutFooter,
      onCloseButtonClick: checkoutStep.handleCrossClick,
      onClickOutside: checkoutStep.handleClickOutside,
      partialSuccess,
    };
  }

  return {
    phase: CHECKOUT_PAYMENT_FLOW_PHASE.PAYMENT,
    isCheckoutPhase: false,
    isPaymentStepActive,
    paymentStep,
    modalTitle,
    isMainModalOpen,
    footer: paymentFooter,
    onCloseButtonClick: paymentCloseHandlers.handleCrossClick,
    onClickOutside: paymentCloseHandlers.handleClickOutside,
    partialSuccess,
  };
};
