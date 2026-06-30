import { useQueryClient } from "@tanstack/react-query";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  fetchInvoiceAPI,
  invoiceKeys,
} from "@bsport/api-financial-services/invoice";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { useFormController } from "@bsport/form";

import type { StripePaymentMethodHandle } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/stripe/types";
import { invalidatePaymentFlowCaches } from "#src/components/financial-services/payment-flow-modal/lib/invalidate-payment-flow-caches";
import { resolveInvoiceInstallmentsEligibility } from "#src/components/financial-services/payment-flow-modal/lib/invoice-installments-eligibility";
import {
  PAYMENT_FLOW_ERROR_KEYS,
  resolveModalSubmitErrorMessage,
  resolveSubmitErrorMessage,
} from "#src/components/financial-services/payment-flow-modal/lib/payment-flow-errors";
import {
  PAYMENT_TAB,
  type PaymentTab,
  buildInstallmentPerIntervalCaptionText,
  buildInstallmentScheduleExplainerText,
  getPaymentFlowDefaultValues,
  installmentScheduleDetailSchema,
  paymentFlowFormSchema,
} from "#src/components/financial-services/payment-flow-modal/lib/payment-flow-form";
import { resolveConfirmAmountCts } from "#src/components/financial-services/payment-flow-modal/lib/resolve-confirm-amount-cts";
import { showPaymentCompletedToast } from "#src/components/financial-services/payment-flow-modal/lib/show-payment-completed-toast";
import {
  PaymentFlowEventName,
  PaymentFlowModalBodyState,
  PaymentFlowModalProps,
} from "#src/components/financial-services/payment-flow-modal/types";
import { usePaymentFlowTracking } from "#src/components/financial-services/payment-flow-modal/use-payment-flow-tracking";
import {
  ALL_PAYMENT_METHOD_SELECTOR_ID,
  type AllPaymentMethodKey,
  SAVED_PAYMENT_METHOD_TYPE,
} from "#src/components/financial-services/payment-method-selector/constants";
import type { PaymentMethodSelectorSelection } from "#src/components/financial-services/payment-method-selector/types";
import { PAYMENT_METHOD_SELECTOR_SELECTION_KIND } from "#src/components/financial-services/payment-method-selector/types";
import { i18nInstance, useTranslation } from "#src/i18n";
import type { CloseTrigger } from "#src/utils/use-guarded-modal-close";

import {
  INSTALLMENTS_DISABLED_ALL_METHOD_IDS,
  getInstallmentsTabStripeClientSecretEngine,
  isInstallmentsSelectionSupportedForScheduling,
} from "./installments-payment-utils";
import { useConfirmPayment } from "./use-confirm-payment";
import { useFetchAvailableGiftcards } from "./use-fetch-available-giftcards";
import { useFetchInvoice } from "./use-fetch-invoice";
import { useFetchMember } from "./use-fetch-member";
import { useFetchStripeReaders } from "./use-fetch-stripe-readers";
import { usePaymentMethodRenderers } from "./use-payment-method-renderers";
import { useRequestPaymentClientSecret } from "./use-request-payment-client-secret";
import { useScheduleInstallmentsPayment } from "./use-schedule-installments-payment";

type PaymentClientSecretEngine = "stripe" | "manual" | "terminal";
type UsePaymentFlowModalStateParams = Omit<
  PaymentFlowModalProps,
  "onConfirm"
> & {
  onConfirm?: (remainingAmountCts: number) => void;
};

/**
 * Resolves which backend engine must generate the payment client secret for
 * the current selector value.
 */
const getPaymentClientSecretEngine = (
  selection: PaymentMethodSelectorSelection,
): PaymentClientSecretEngine | null => {
  if (!selection) return null;

  // Saved payment methods are always handled by Stripe.
  if (selection.kind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED)
    return "stripe";

  // New payment methods are handled by the appropriate engine.
  if (
    selection.id === SAVED_PAYMENT_METHOD_TYPE.CARD ||
    selection.id === SAVED_PAYMENT_METHOD_TYPE.SEPA_DEBIT
  )
    return "stripe";
  if (selection.id === ALL_PAYMENT_METHOD_SELECTOR_ID.MANUAL) return "manual";
  if (selection.id === ALL_PAYMENT_METHOD_SELECTOR_ID.TERMINAL)
    return "terminal";

  return null;
};

const PARTIAL_UNSUPPORTED_METHOD_IDS = new Set<AllPaymentMethodKey>([
  ALL_PAYMENT_METHOD_SELECTOR_ID.GIFT_CARD_CODE,
  ALL_PAYMENT_METHOD_SELECTOR_ID.ACCOUNT_BALANCE,
]);

/**
 * Central state and orchestration hook for `PaymentFlowModal`.
 *
 * Responsibilities:
 * - fetches invoice/member/reader data used by the modal;
 * - derives remaining amount and payment capability flags;
 * - coordinates payment client-secret lifecycle based on selected method;
 * - exposes submission state and UI-ready body props.
 */
const serializePaymentMethod = (
  selection: PaymentMethodSelectorSelection,
): string | null => {
  if (!selection) return null;
  if (selection.kind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED) {
    return `saved_${selection.paymentMethodType}`;
  }
  return selection.id;
};

export const usePaymentFlowModalState = ({
  isOpen,
  invoiceId,
  memberId,
  fetch,
  onClose,
  onConfirm,
  companyTheme,
  onPaymentTrack,
  paymentStartTrigger,
  trackingSessionId,
}: UsePaymentFlowModalStateParams) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const queryClient = useQueryClient();

  const [activeTab, setActiveTabState] = useState<PaymentTab>(
    PAYMENT_TAB.ONE_TIME,
  );
  const [isPartialEnabled, setIsPartialEnabled] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodSelectorSelection>(null);

  const hasTrackedStartRef = useRef(false);
  const { track } = usePaymentFlowTracking({
    onTrack: onPaymentTrack,
    trackingSessionId,
  });
  const [clientSecretEngine, setClientSecretEngine] =
    useState<PaymentClientSecretEngine | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [
    shouldInvalidateCachesAfterClose,
    setShouldInvalidateCachesAfterClose,
  ] = useState(false);

  const formId = `payment-flow-modal-${useId()}`;
  const cardPaymentRef = useRef<StripePaymentMethodHandle>(null);
  const sepaPaymentRef = useRef<StripePaymentMethodHandle>(null);
  const methods = useFormController({
    schema: paymentFlowFormSchema,
    defaultValues: getPaymentFlowDefaultValues(),
    mode: "onChange",
  });

  const { data: member } = useFetchMember(fetch, memberId, isOpen);
  const { data: invoice, isLoading: isLoadingInvoice } = useFetchInvoice(
    fetch,
    invoiceId,
    isOpen,
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
  const invoiceRemainingAmountCts = Number.isFinite(invoiceRemainingAmount)
    ? Math.round(invoiceRemainingAmount * 100)
    : 0;

  useEffect(() => {
    if (!isOpen) {
      hasTrackedStartRef.current = false;
      return;
    }
    if (hasTrackedStartRef.current || !trackingSessionId || !onPaymentTrack)
      return;
    if (isLoadingInvoice) return;

    track("payment_flow_start", {
      member_id: memberId,
      invoice_id: invoiceId,
      total_amount_to_pay: invoiceRemainingAmountCts,
      payment_method_selected: null,
      payment_start_trigger: paymentStartTrigger ?? "invoice",
      origin_url:
        typeof window !== "undefined" ? window.location.href : undefined,
    });
    hasTrackedStartRef.current = true;
  }, [
    isOpen,
    trackingSessionId,
    onPaymentTrack,
    isLoadingInvoice,
    invoiceRemainingAmountCts,
    memberId,
    invoiceId,
    paymentStartTrigger,
    track,
  ]);

  const installmentsEligibility = useMemo(() => {
    if (!invoice) {
      return { eligible: false, reason: null } as const;
    }

    return resolveInvoiceInstallmentsEligibility({
      invoiceType: invoice.invoice_type,
      plannedinvoice: invoice.plannedinvoice,
      sourceInvoice: invoice.source_invoice,
      reverted: invoice.reverted,
      invoiceMemberId: invoice.member,
      amountToPayCts: invoiceRemainingAmountCts,
    });
  }, [invoice, invoiceRemainingAmountCts]);

  const installmentsTabDisabled =
    isInvoiceAlreadyPaid || !installmentsEligibility.eligible;

  const installmentsTabTooltip = useMemo(() => {
    if (!installmentsTabDisabled) return undefined;
    if (isInvoiceAlreadyPaid) {
      return t("paymentFlowModal.installmentsEligibility.nothingToPay");
    }
    if (installmentsEligibility.reason) {
      return t(
        `paymentFlowModal.installmentsEligibility.${installmentsEligibility.reason}`,
      );
    }
    return undefined;
  }, [
    installmentsEligibility.reason,
    installmentsTabDisabled,
    isInvoiceAlreadyPaid,
    t,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    if (activeTab !== PAYMENT_TAB.INSTALLMENTS) return;
    if (!installmentsEligibility.eligible || isInvoiceAlreadyPaid) {
      setActiveTabState(PAYMENT_TAB.ONE_TIME);
    }
  }, [
    activeTab,
    installmentsEligibility.eligible,
    isInvoiceAlreadyPaid,
    isOpen,
  ]);

  useEffect(() => {
    if (
      activeTab !== PAYMENT_TAB.INSTALLMENTS ||
      selectedPaymentMethod?.kind !==
        PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL ||
      selectedPaymentMethod.id !== ALL_PAYMENT_METHOD_SELECTOR_ID.GIFT_CARD_CODE
    )
      return;

    setSelectedPaymentMethod(null);
    methods.setValue("selectedGiftCardId", null, {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [activeTab, methods, selectedPaymentMethod]);

  const partialAmountCts = methods.watch("partialAmountCts");
  const installmentInterval = methods.watch("installmentInterval");
  const installmentRecurrenceBasis = methods.watch(
    "installmentRecurrenceBasis",
  );
  const installmentNbInterval = methods.watch("installmentNbInterval");
  const installmentAnchorDate = methods.watch("installmentAnchorDate");

  const {
    installmentScheduleDetail,
    installmentPerIntervalCaption,
    installmentScheduleValues,
  } = useMemo(() => {
    const parsed = installmentScheduleDetailSchema.safeParse({
      installmentInterval,
      installmentRecurrenceBasis,
      installmentNbInterval,
    });
    if (!parsed.success) {
      return {
        installmentScheduleDetail: null,
        installmentPerIntervalCaption: null,
        installmentScheduleValues: null,
      } as const;
    }
    return {
      installmentScheduleDetail: buildInstallmentScheduleExplainerText(
        parsed.data,
      ),
      installmentPerIntervalCaption: buildInstallmentPerIntervalCaptionText(
        invoiceRemainingAmountCts,
        parsed.data,
      ),
      installmentScheduleValues: parsed.data,
    } as const;
  }, [
    installmentInterval,
    installmentNbInterval,
    installmentRecurrenceBasis,
    invoiceRemainingAmountCts,
  ]);

  const [committedPartialAmountCts, setCommittedPartialAmountCts] =
    useState(partialAmountCts);
  const [isPartialAmountFocused, setIsPartialAmountFocused] = useState(false);

  useEffect(() => {
    if (!isOpen || !Number.isFinite(invoiceRemainingAmountCts)) return;
    setCommittedPartialAmountCts(invoiceRemainingAmountCts);
  }, [invoiceRemainingAmountCts, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsPartialEnabled(false);
      setIsPartialAmountFocused(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isPartialEnabled) return;
    if (partialAmountCts <= 0 || partialAmountCts > invoiceRemainingAmountCts) {
      return;
    }
    if (partialAmountCts === committedPartialAmountCts) return;

    const timeoutId = window.setTimeout(() => {
      setCommittedPartialAmountCts(partialAmountCts);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    committedPartialAmountCts,
    invoiceRemainingAmountCts,
    isOpen,
    isPartialEnabled,
    partialAmountCts,
  ]);

  useEffect(() => {
    const nextEngine =
      activeTab === PAYMENT_TAB.INSTALLMENTS
        ? getInstallmentsTabStripeClientSecretEngine(selectedPaymentMethod)
        : getPaymentClientSecretEngine(selectedPaymentMethod);
    if (nextEngine === clientSecretEngine) return;

    setClientSecretEngine(nextEngine);
  }, [activeTab, clientSecretEngine, selectedPaymentMethod]);

  const requestedClientSecretPriceCts =
    isPartialEnabled && committedPartialAmountCts !== invoiceRemainingAmountCts
      ? committedPartialAmountCts
      : undefined;

  const paymentClientSecretQuery = useRequestPaymentClientSecret({
    fetch,
    invoiceId,
    paymentEngine: clientSecretEngine,
    requestedPriceCts: requestedClientSecretPriceCts,
    enabled:
      isOpen &&
      !isLoadingInvoice &&
      !isInvoiceAlreadyPaid &&
      invoiceId.length > 0 &&
      clientSecretEngine !== null,
  });
  const paymentClientSecretErrorMessage = useMemo(() => {
    if (!paymentClientSecretQuery.isError || !paymentClientSecretQuery.error) {
      return null;
    }

    return resolveSubmitErrorMessage(paymentClientSecretQuery.error);
  }, [paymentClientSecretQuery.error, paymentClientSecretQuery.isError]);

  const accountBalance = Number(member?.credit_account_balance);
  const hasPositiveAccountBalance = accountBalance > 0;
  const isAccountBalanceEnough =
    hasPositiveAccountBalance &&
    Number.isFinite(invoiceRemainingAmount) &&
    accountBalance >= invoiceRemainingAmount;
  const hasStripeReaders = stripeReaders.length > 0;

  const isGiftCardPaymentMethodSelected =
    isOpen &&
    selectedPaymentMethod?.kind ===
      PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL &&
    selectedPaymentMethod.id === ALL_PAYMENT_METHOD_SELECTOR_ID.GIFT_CARD_CODE;

  const { giftcards: availableGiftCards } = useFetchAvailableGiftcards({
    fetch,
    memberId,
    enabled: isGiftCardPaymentMethodSelected,
  });

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
    companyTheme,
  });

  const confirmPaymentMutation = useConfirmPayment({
    fetch,
    invoiceId,
    invoiceRemainingAmount,
    isInvoiceAlreadyPaid,
    selectedPaymentMethod,
    paymentClientSecret: paymentClientSecretQuery.data ?? {},
    getFormValues: () => ({
      savePaymentMethod: methods.getValues("savePaymentMethod"),
      terminalReaderId: methods.getValues("terminalReaderId"),
      selectedGiftCardId: methods.getValues("selectedGiftCardId"),
      partialAmountCts: methods.getValues("partialAmountCts"),
      manualType: methods.getValues("manualType"),
      manualDate: methods.getValues("manualDate"),
      manualNote: methods.getValues("manualNote"),
    }),
    availableGiftCards,
    cardPaymentRef,
    sepaPaymentRef,
    stripePublishableKey: companyTheme?.stripe_pk_key,
    invoiceAlreadyPaidAlert: PAYMENT_FLOW_ERROR_KEYS.invoiceAlreadyPaid,
  });

  const scheduleInstallmentsMutation = useScheduleInstallmentsPayment({
    fetch,
    invoiceId,
    selectedPaymentMethod,
    manualType: methods.watch("manualType"),
    installmentScheduleValues,
    installmentAnchorDate,
    isInvoiceAlreadyPaid,
    paymentClientSecret: paymentClientSecretQuery.data ?? {},
    getSavePaymentMethod: () => methods.getValues("savePaymentMethod"),
    cardPaymentRef,
    sepaPaymentRef,
  });

  const terminalReaderId = methods.watch("terminalReaderId");
  const selectedGiftCardId = methods.watch("selectedGiftCardId");
  const partialAmountError = methods.formState.errors.partialAmountCts?.message;
  const partialAmountMinError = t("paymentFlowModal.partialAmount.errors.min");
  const partialAmountMaxError = t("paymentFlowModal.partialAmount.errors.max");

  const isPartialSupportedForSelectedMethod =
    selectedPaymentMethod?.kind !==
      PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL ||
    !PARTIAL_UNSUPPORTED_METHOD_IDS.has(selectedPaymentMethod.id);

  const disabledAllMethodIds = useMemo(() => {
    const ids = new Set<AllPaymentMethodKey>();
    if (isPartialEnabled) {
      for (const id of PARTIAL_UNSUPPORTED_METHOD_IDS) {
        ids.add(id);
      }
    }
    if (activeTab === PAYMENT_TAB.INSTALLMENTS) {
      for (const id of INSTALLMENTS_DISABLED_ALL_METHOD_IDS) {
        ids.add(id);
      }
    }
    return Array.from(ids);
  }, [activeTab, isPartialEnabled]);
  const isPartialAmountInvalidLow = partialAmountCts <= 0;
  const isPartialAmountInvalidHigh =
    partialAmountCts > invoiceRemainingAmountCts;
  const computedPartialAmountError =
    isPartialEnabled &&
    isOpen &&
    isPartialSupportedForSelectedMethod &&
    (isPartialAmountInvalidLow || isPartialAmountInvalidHigh)
      ? isPartialAmountInvalidLow
        ? partialAmountMinError
        : partialAmountMaxError
      : null;

  const isPartialAmountPendingCommit =
    isPartialEnabled && partialAmountCts !== committedPartialAmountCts;

  useEffect(() => {
    if (isPartialEnabled && !isPartialSupportedForSelectedMethod) {
      setIsPartialEnabled(false);
    }
  }, [isPartialEnabled, isPartialSupportedForSelectedMethod]);

  useEffect(() => {
    if (!isOpen || !Number.isFinite(invoiceRemainingAmountCts)) return;
    const currentPartialAmountCts = methods.getValues("partialAmountCts");
    if (currentPartialAmountCts !== invoiceRemainingAmountCts) {
      methods.setValue("partialAmountCts", invoiceRemainingAmountCts, {
        shouldDirty: false,
        shouldValidate: false,
      });
      methods.clearErrors("partialAmountCts");
    }
  }, [invoiceRemainingAmountCts, isOpen, methods]);

  useEffect(() => {
    if (!isPartialEnabled || !isOpen) {
      if (partialAmountError) {
        methods.clearErrors("partialAmountCts");
      }
      return;
    }

    if (!isPartialSupportedForSelectedMethod) {
      if (partialAmountError) {
        methods.clearErrors("partialAmountCts");
      }
      return;
    }

    if (partialAmountCts <= 0) {
      if (partialAmountError !== partialAmountMinError) {
        methods.setError("partialAmountCts", {
          message: partialAmountMinError,
        });
      }
      return;
    }

    if (partialAmountCts > invoiceRemainingAmountCts) {
      if (partialAmountError !== partialAmountMaxError) {
        methods.setError("partialAmountCts", {
          message: partialAmountMaxError,
        });
      }
      return;
    }

    if (partialAmountError) {
      methods.clearErrors("partialAmountCts");
    }
  }, [
    invoiceRemainingAmountCts,
    isOpen,
    isPartialEnabled,
    isPartialSupportedForSelectedMethod,
    methods,
    partialAmountError,
    partialAmountCts,
    partialAmountMaxError,
    partialAmountMinError,
  ]);

  const hasInstallmentFieldErrors =
    activeTab === PAYMENT_TAB.INSTALLMENTS &&
    Boolean(
      methods.formState.errors.installmentInterval ||
        methods.formState.errors.installmentRecurrenceBasis ||
        methods.formState.errors.installmentNbInterval ||
        methods.formState.errors.installmentAnchorDate,
    );

  const isConfirmDisabled = useMemo(() => {
    const isGiftCardSelectedInInstallmentsTab =
      activeTab === PAYMENT_TAB.INSTALLMENTS &&
      selectedPaymentMethod?.kind ===
        PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL &&
      selectedPaymentMethod.id ===
        ALL_PAYMENT_METHOD_SELECTOR_ID.GIFT_CARD_CODE;

    const isWaitingForPartialAmountCommit =
      isPartialEnabled &&
      (isPartialAmountFocused || isPartialAmountPendingCommit);

    const isSubmitting =
      activeTab === PAYMENT_TAB.INSTALLMENTS
        ? scheduleInstallmentsMutation.isPending
        : confirmPaymentMutation.isPending;

    if (
      isInvoiceAlreadyPaid ||
      !selectedPaymentMethod ||
      isSubmitting ||
      hasInstallmentFieldErrors ||
      isGiftCardSelectedInInstallmentsTab ||
      isWaitingForPartialAmountCommit
    ) {
      return true;
    }

    if (activeTab === PAYMENT_TAB.INSTALLMENTS) {
      if (
        !isInstallmentsSelectionSupportedForScheduling(selectedPaymentMethod)
      ) {
        return true;
      }
      if (
        getInstallmentsTabStripeClientSecretEngine(selectedPaymentMethod) ===
          "stripe" &&
        (paymentClientSecretQuery.isFetching ||
          !paymentClientSecretQuery.data?.client_secret)
      ) {
        return true;
      }
      return false;
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

    if (
      isPartialEnabled &&
      (computedPartialAmountError != null ||
        methods.formState.errors.partialAmountCts != null)
    ) {
      return true;
    }

    if (
      selectedPaymentMethod.kind !== PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL
    )
      return false;

    if (
      isPartialEnabled &&
      PARTIAL_UNSUPPORTED_METHOD_IDS.has(selectedPaymentMethod.id)
    ) {
      return true;
    }

    if (
      selectedPaymentMethod.id === ALL_PAYMENT_METHOD_SELECTOR_ID.TERMINAL &&
      (!terminalReaderId || isLoadingStripeReaders)
    ) {
      return true;
    }

    return false;
  }, [
    activeTab,
    computedPartialAmountError,
    confirmPaymentMutation.isPending,
    scheduleInstallmentsMutation.isPending,
    hasInstallmentFieldErrors,
    isInvoiceAlreadyPaid,
    isLoadingStripeReaders,
    isPartialAmountFocused,
    isPartialAmountPendingCommit,
    paymentClientSecretQuery.data?.client_secret,
    paymentClientSecretQuery.isFetching,
    isPartialEnabled,
    methods.formState.errors.partialAmountCts,
    selectedPaymentMethod,
    terminalReaderId,
  ]);

  const isConfirmLoading = useMemo(() => {
    if (activeTab === PAYMENT_TAB.INSTALLMENTS) {
      if (scheduleInstallmentsMutation.isPending) return true;
      if (
        getInstallmentsTabStripeClientSecretEngine(selectedPaymentMethod) ===
          "stripe" &&
        paymentClientSecretQuery.isFetching
      ) {
        return true;
      }
      return false;
    }

    if (confirmPaymentMutation.isPending) return true;

    if (!selectedPaymentMethod || isInvoiceAlreadyPaid) return false;

    const selectedMethodNeedsClientSecret =
      getPaymentClientSecretEngine(selectedPaymentMethod) !== null;
    const isBlockedByClientSecretLoading =
      selectedMethodNeedsClientSecret && paymentClientSecretQuery.isFetching;

    if (
      selectedPaymentMethod.kind !== PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL
    ) {
      return isBlockedByClientSecretLoading;
    }

    const hasNonLoadingBlocker =
      (selectedPaymentMethod.id === ALL_PAYMENT_METHOD_SELECTOR_ID.TERMINAL &&
        !terminalReaderId) ||
      (selectedPaymentMethod.id ===
        ALL_PAYMENT_METHOD_SELECTOR_ID.GIFT_CARD_CODE &&
        !selectedGiftCardId);

    if (hasNonLoadingBlocker) return false;

    const isBlockedByTerminalLoading =
      selectedPaymentMethod.id === ALL_PAYMENT_METHOD_SELECTOR_ID.TERMINAL &&
      isLoadingStripeReaders;

    return isBlockedByClientSecretLoading || isBlockedByTerminalLoading;
  }, [
    activeTab,
    confirmPaymentMutation.isPending,
    isInvoiceAlreadyPaid,
    isLoadingStripeReaders,
    paymentClientSecretQuery.isFetching,
    scheduleInstallmentsMutation.isPending,
    selectedGiftCardId,
    selectedPaymentMethod,
    terminalReaderId,
  ]);

  const refreshInvoiceCache = useCallback(async () => {
    const freshInvoice = await fetchInvoiceAPI(fetch, invoiceId);
    queryClient.setQueryData(invoiceKeys.detail(invoiceId), freshInvoice);
  }, [fetch, invoiceId, queryClient]);

  const dismissMainModal = useCallback(() => {
    const base = getPaymentFlowDefaultValues();
    const nextPartialAmountCts =
      Number.isFinite(invoiceRemainingAmountCts) &&
      invoiceRemainingAmountCts >= 0
        ? invoiceRemainingAmountCts
        : base.partialAmountCts;

    methods.reset(
      {
        ...base,
        partialAmountCts: nextPartialAmountCts,
      },
      { keepDirty: false, keepTouched: false },
    );

    setActiveTabState(PAYMENT_TAB.ONE_TIME);
    setIsPartialEnabled(false);
    setIsPartialAmountFocused(false);
    setCommittedPartialAmountCts(nextPartialAmountCts);
    setSelectedPaymentMethod(null);
    setClientSecretEngine(null);
    setSubmitError(null);
  }, [invoiceRemainingAmountCts, methods]);

  const closeModal = useCallback(() => {
    dismissMainModal();
    onClose();
  }, [dismissMainModal, onClose]);

  useEffect(() => {
    if (isOpen || !shouldInvalidateCachesAfterClose) return;

    setShouldInvalidateCachesAfterClose(false);
    invalidatePaymentFlowCaches(queryClient, { invoiceId, memberId });
  }, [
    isOpen,
    shouldInvalidateCachesAfterClose,
    invoiceId,
    memberId,
    queryClient,
  ]);

  const dueAmountCts = isPartialEnabled
    ? partialAmountCts
    : invoiceRemainingAmountCts;
  const selectedGiftCard =
    availableGiftCards.find((giftCard) => giftCard.id === selectedGiftCardId) ??
    null;
  const confirmAmountCts = resolveConfirmAmountCts({
    activeTab,
    dueAmountCts,
    selectedPaymentMethod,
    accountBalance,
    selectedGiftCard,
    clientSecretPriceCts: paymentClientSecretQuery.data?.price_cts,
  });

  const handleSubmit = () => {
    track("payment_flow_confirm_button_clicked", {
      member_id: memberId,
      invoice_id: invoiceId,
      total_amount_to_pay: invoiceRemainingAmountCts,
      payment_method_selected: serializePaymentMethod(selectedPaymentMethod),
      amount_to_pay: confirmAmountCts,
    });

    if (activeTab === PAYMENT_TAB.INSTALLMENTS) {
      setSubmitError(null);
      scheduleInstallmentsMutation.mutate(undefined, {
        onSuccess: () => {
          setShouldInvalidateCachesAfterClose(true);
          onConfirm?.(0);
          closeModal();
        },
        onError: (error: unknown) => {
          setSubmitError(
            resolveModalSubmitErrorMessage(error, selectedPaymentMethod),
          );
          if (
            error instanceof Error &&
            error.message === PAYMENT_FLOW_ERROR_KEYS.invoiceAlreadyPaid
          ) {
            void queryClient.invalidateQueries({
              queryKey: invoiceKeys.detail(invoiceId),
            });
          }
        },
      });
      return;
    }

    const submissionRemainingAmountCts = Math.max(
      invoiceRemainingAmountCts - confirmAmountCts,
      0,
    );
    setSubmitError(null);
    confirmPaymentMutation.mutate(undefined, {
      onSuccess: () => {
        setShouldInvalidateCachesAfterClose(true);
        onConfirm?.(submissionRemainingAmountCts);

        if (submissionRemainingAmountCts > 0) {
          refreshInvoiceCache();
          dismissMainModal();
          return;
        }

        showPaymentCompletedToast();
        closeModal();
      },
      onError: (error: unknown) => {
        setSubmitError(
          resolveModalSubmitErrorMessage(error, selectedPaymentMethod),
        );
        if (
          error instanceof Error &&
          error.message === PAYMENT_FLOW_ERROR_KEYS.invoiceAlreadyPaid
        ) {
          void queryClient.invalidateQueries({
            queryKey: invoiceKeys.detail(invoiceId),
          });
        }
      },
    });
  };

  const amountToPay = Number.isNaN(invoiceRemainingAmount)
    ? "--"
    : getCurrencyDisplayWithPrice(invoiceRemainingAmount);
  const partialAmount = partialAmountCts / 100;
  const remainingAmount = Math.max(invoiceRemainingAmount - partialAmount, 0);
  const remainingAmountText = isPartialEnabled
    ? t("paymentFlowModal.partialAmount.remainingHelper", {
        amount: getCurrencyDisplayWithPrice(remainingAmount),
      })
    : null;

  const shouldShowMemberBalanceWarning =
    selectedPaymentMethod?.kind ===
      PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL &&
    selectedPaymentMethod.id ===
      ALL_PAYMENT_METHOD_SELECTOR_ID.ACCOUNT_BALANCE &&
    hasPositiveAccountBalance &&
    !isAccountBalanceEnough;

  const shouldShowGiftCardInsufficientAlert =
    isGiftCardPaymentMethodSelected &&
    selectedGiftCard !== null &&
    Math.round(selectedGiftCard.availableAmount * 100) <
      invoiceRemainingAmountCts;

  const handlePartialAmountFocus = () => {
    setIsPartialAmountFocused(true);
  };

  const handlePartialAmountBlur = () => {
    setIsPartialAmountFocused(false);
    const nextAmountCts = methods.getValues("partialAmountCts");
    if (nextAmountCts > 0 && nextAmountCts <= invoiceRemainingAmountCts) {
      setCommittedPartialAmountCts(nextAmountCts);
    }
  };

  const handlePartialToggle = (enabled: boolean) => {
    track(
      enabled
        ? "payment_flow_partial_payment_toggle_on"
        : "payment_flow_partial_payment_toggle_off",
      {
        member_id: memberId,
        invoice_id: invoiceId,
        total_amount_to_pay: invoiceRemainingAmountCts,
        payment_method_selected: serializePaymentMethod(selectedPaymentMethod),
        amount_to_pay: resolveConfirmAmountCts({
          activeTab,
          // Toggling in either direction resets the partial amount to the full
          // invoice amount, so the post-toggle amount to pay is always the full
          // remaining amount rather than the (pre-toggle) partial amount.
          dueAmountCts: invoiceRemainingAmountCts,
          selectedPaymentMethod,
          accountBalance,
          selectedGiftCard,
          clientSecretPriceCts: paymentClientSecretQuery.data?.price_cts,
        }),
      },
    );
    setIsPartialEnabled(enabled);
    if (!Number.isFinite(invoiceRemainingAmountCts)) return;

    methods.setValue("partialAmountCts", invoiceRemainingAmountCts, {
      shouldDirty: false,
      shouldValidate: false,
    });
    setCommittedPartialAmountCts(invoiceRemainingAmountCts);
    setIsPartialAmountFocused(false);
    methods.clearErrors("partialAmountCts");
  };

  const setActiveTab = (tab: PaymentTab) => {
    if (tab === PAYMENT_TAB.INSTALLMENTS) {
      if (isPartialEnabled) {
        handlePartialToggle(false);
      }
      track("payment_flow_installments_selected", {
        member_id: memberId,
        invoice_id: invoiceId,
        total_amount_to_pay: invoiceRemainingAmountCts,
        payment_method_selected: serializePaymentMethod(selectedPaymentMethod),
      });
    } else {
      track("payment_flow_one_time_selected", {
        member_id: memberId,
        invoice_id: invoiceId,
        total_amount_to_pay: invoiceRemainingAmountCts,
        payment_method_selected: serializePaymentMethod(selectedPaymentMethod),
      });
    }
    setActiveTabState(tab);
  };

  const handleSelectionChange = (selection: PaymentMethodSelectorSelection) => {
    setSelectedPaymentMethod(selection);
    track("payment_flow_payment_method_selected", {
      member_id: memberId,
      invoice_id: invoiceId,
      total_amount_to_pay: invoiceRemainingAmountCts,
      payment_method_selected: serializePaymentMethod(selection),
      amount_to_pay: resolveConfirmAmountCts({
        activeTab,
        dueAmountCts,
        selectedPaymentMethod: selection,
        accountBalance,
        selectedGiftCard,
        clientSecretPriceCts: paymentClientSecretQuery.data?.price_cts,
      }),
    });
  };

  const body: PaymentFlowModalBodyState = {
    memberId,
    fetch,
    activeTab,
    setActiveTab,
    installmentsTabDisabled,
    installmentsTabTooltip,
    isPartialEnabled,
    setIsPartialEnabled: handlePartialToggle,
    onPartialAmountFocus: handlePartialAmountFocus,
    onPartialAmountBlur: handlePartialAmountBlur,
    partialAmountCts,
    partialAmountError:
      computedPartialAmountError ??
      (typeof partialAmountError === "string" ? partialAmountError : null),
    remainingAmountText,
    isPartialSupportedForSelectedMethod,
    amountToPay,
    isInvoiceAlreadyPaid,
    shouldShowMemberBalanceWarning,
    shouldShowGiftCardInsufficientAlert,
    submitError: submitError ?? paymentClientSecretErrorMessage,
    hasPositiveAccountBalance,
    isAccountBalanceEnough,
    accountBalance,
    hiddenAllMethodIds: renderers.hiddenAllMethodIds,
    disabledAllMethodIds,
    onSelectionChange: handleSelectionChange,
    renderSelectedPaymentMethod: renderers.renderSelectedPaymentMethod,
    memberName: member?.name ?? `#${memberId}`,
    invoiceUrl: `/invoice/${invoiceId}`,
    memberUrl: `/member/${memberId}`,
    installmentScheduleDetail,
    installmentPerIntervalCaption,
    invoiceRemainingAmountCts,
    onInvoiceButtonClick: () => {
      track("payment_flow_invoice_button_clicked", {
        member_id: memberId,
        invoice_id: invoiceId,
        total_amount_to_pay: invoiceRemainingAmountCts,
        payment_method_selected: serializePaymentMethod(selectedPaymentMethod),
        amount_to_pay: confirmAmountCts,
      });
      if (typeof window !== "undefined") {
        window.open(`/invoice/${invoiceId}`, "_blank", "noopener,noreferrer");
      }
    },
    onMemberButtonClick: () => {
      track("payment_flow_member_button_clicked", {
        member_id: memberId,
        invoice_id: invoiceId,
        total_amount_to_pay: invoiceRemainingAmountCts,
        payment_method_selected: serializePaymentMethod(selectedPaymentMethod),
        amount_to_pay: confirmAmountCts,
      });
      if (typeof window !== "undefined") {
        window.open(`/member/${memberId}`, "_blank", "noopener,noreferrer");
      }
    },
  };

  const CLOSE_TRIGGER_EVENT_MAP: Record<CloseTrigger, PaymentFlowEventName> = {
    cancel_button: "payment_flow_cancel_button_clicked",
    cross_button: "payment_flow_cross_button_clicked",
    escape_key: "payment_flow_escape_key_pressed",
    backdrop_click: "payment_flow_click_outside",
  };

  const handleClose = (trigger: CloseTrigger) => {
    track(CLOSE_TRIGGER_EVENT_MAP[trigger], {
      member_id: memberId,
      invoice_id: invoiceId,
      total_amount_to_pay: invoiceRemainingAmountCts,
      payment_method_selected: serializePaymentMethod(selectedPaymentMethod),
      amount_to_pay: confirmAmountCts,
    });
    closeModal();
  };

  return {
    methods,
    formId,
    handleSubmit,
    closeModal,
    handleClose,
    dismissMainModal,
    isConfirmDisabled,
    isConfirmLoading,
    confirmAmountCts,
    remainingAmountCts: Math.max(
      invoiceRemainingAmountCts -
        (isPartialEnabled ? partialAmountCts : invoiceRemainingAmountCts),
      0,
    ),
    body,
  };
};
