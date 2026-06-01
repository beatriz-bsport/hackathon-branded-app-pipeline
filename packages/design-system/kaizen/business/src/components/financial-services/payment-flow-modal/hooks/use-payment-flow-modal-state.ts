import { useQueryClient } from "@tanstack/react-query";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { memberKeys } from "@bsport/api-cdp/member";
import { invoiceKeys } from "@bsport/api-financial-services/invoice";
import { paymentGroupKeys } from "@bsport/api-financial-services/payment-group";
import { paymentMethodKeys } from "@bsport/api-financial-services/payment-method";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { useFormController } from "@bsport/form";

import type { PaymentFlowGiftCard } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/gift-card/types";
import type { StripePaymentMethodHandle } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/stripe/types";
import { resolveInvoiceInstallmentsEligibility } from "#src/components/financial-services/payment-flow-modal/lib/invoice-installments-eligibility";
import {
  PAYMENT_FLOW_ERROR_KEYS,
  resolveModalSubmitErrorMessage,
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
import type {
  PaymentFlowModalBodyState,
  PaymentFlowModalProps,
} from "#src/components/financial-services/payment-flow-modal/types";
import {
  ALL_PAYMENT_METHOD_SELECTOR_ID,
  type AllPaymentMethodKey,
  SAVED_PAYMENT_METHOD_TYPE,
} from "#src/components/financial-services/payment-method-selector/constants";
import type { PaymentMethodSelectorSelection } from "#src/components/financial-services/payment-method-selector/types";
import { PAYMENT_METHOD_SELECTOR_SELECTION_KIND } from "#src/components/financial-services/payment-method-selector/types";
import { i18nInstance, useTranslation } from "#src/i18n";

import {
  INSTALLMENTS_DISABLED_ALL_METHOD_IDS,
  getInstallmentsTabStripeClientSecretEngine,
  isInstallmentsSelectionSupportedForScheduling,
} from "./installments-payment-utils";
import { useConfirmPayment } from "./use-confirm-payment";
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
export const usePaymentFlowModalState = ({
  isOpen,
  invoiceId,
  memberId,
  fetch,
  onClose,
  onConfirm,
  companyTheme,
}: UsePaymentFlowModalStateParams) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const queryClient = useQueryClient();

  const [activeTab, setActiveTabState] = useState<PaymentTab>(
    PAYMENT_TAB.ONE_TIME,
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
    mode: "onChange",
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
  const invoiceRemainingAmountCts = Number.isFinite(invoiceRemainingAmount)
    ? Math.round(invoiceRemainingAmount * 100)
    : 0;

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
    companyTheme,
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
    if (
      selectedPaymentMethod.id ===
        ALL_PAYMENT_METHOD_SELECTOR_ID.GIFT_CARD_CODE &&
      !selectedGiftCardId
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
    selectedGiftCardId,
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
    setAvailableGiftCards([]);
  }, [invoiceRemainingAmountCts, methods]);

  const closeModal = useCallback(() => {
    dismissMainModal();
    onClose();
  }, [dismissMainModal, onClose]);

  const handleSubmit = () => {
    if (activeTab === PAYMENT_TAB.INSTALLMENTS) {
      setSubmitError(null);
      scheduleInstallmentsMutation.mutate(undefined, {
        onSuccess: () => {
          onConfirm?.(0);
          closeModal();
          window.setTimeout(() => {
            void Promise.all([
              queryClient.invalidateQueries({
                queryKey: invoiceKeys.detail(invoiceId),
              }),
              queryClient.invalidateQueries({
                queryKey: paymentGroupKeys.all,
              }),
              queryClient.invalidateQueries({
                queryKey: paymentMethodKeys.saved(memberId),
              }),
              queryClient.invalidateQueries({
                queryKey: memberKeys.detail(memberId),
              }),
            ]);
          }, 0);
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

    const submittedAmountCts = isPartialEnabled
      ? methods.getValues("partialAmountCts")
      : invoiceRemainingAmountCts;
    const submissionRemainingAmountCts = Math.max(
      invoiceRemainingAmountCts - submittedAmountCts,
      0,
    );
    setSubmitError(null);
    confirmPaymentMutation.mutate(undefined, {
      onSuccess: () => {
        onConfirm?.(submissionRemainingAmountCts);
        if (submissionRemainingAmountCts > 0) {
          dismissMainModal();
        } else {
          closeModal();
        }
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
      handlePartialToggle(false);
    }
    setActiveTabState(tab);
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
    submitError: submitError ?? paymentClientSecretErrorMessage,
    hasPositiveAccountBalance,
    isAccountBalanceEnough,
    accountBalance,
    hiddenAllMethodIds: renderers.hiddenAllMethodIds,
    disabledAllMethodIds,
    onSelectionChange: setSelectedPaymentMethod,
    renderSelectedPaymentMethod: renderers.renderSelectedPaymentMethod,
    memberName: member?.name ?? `#${memberId}`,
    invoiceUrl: `/invoice/${invoiceId}`,
    memberUrl: `/member/${memberId}`,
    installmentScheduleDetail,
    installmentPerIntervalCaption,
    invoiceRemainingAmountCts,
  };

  return {
    methods,
    formId,
    handleSubmit,
    closeModal,
    dismissMainModal,
    isConfirmDisabled,
    isConfirmLoading,
    confirmAmountCts:
      activeTab === PAYMENT_TAB.INSTALLMENTS
        ? 0
        : isPartialEnabled
          ? partialAmountCts
          : invoiceRemainingAmountCts,
    remainingAmountCts: Math.max(
      invoiceRemainingAmountCts -
        (isPartialEnabled ? partialAmountCts : invoiceRemainingAmountCts),
      0,
    ),
    body,
  };
};
