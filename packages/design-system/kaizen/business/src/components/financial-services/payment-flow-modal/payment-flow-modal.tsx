import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useMemo, useRef, useState } from "react";

import {
  fetchInvoiceAPI,
  invoiceKeys,
} from "@bsport/api-financial-services/invoice";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { Modal, toast } from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";
import { useGuardedModalClose } from "#src/utils/use-guarded-modal-close";

import { PartialSuccessModal } from "./components/partial-success-modal";
import { usePaymentFlowModalState } from "./hooks/use-payment-flow-modal-state";
import { PaymentFlowStep } from "./payment-flow-step";
import type { PaymentFlowModalProps } from "./types";

export const PaymentFlowModal: React.FC<PaymentFlowModalProps> = ({
  isOpen,
  invoiceId,
  memberId,
  fetch,
  onClose,
  onConfirm,
  companyTheme,
}: PaymentFlowModalProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const queryClient = useQueryClient();
  const [isPartialSuccessOpen, setIsPartialSuccessOpen] = useState(false);
  const [isInternalOpen, setIsInternalOpen] = useState(false);
  const shouldDismissFlowOnPartialSuccessCloseRef = useRef(true);
  const [
    partialSuccessRemainingAmountCts,
    setPartialSuccessRemainingAmountCts,
  ] = useState(0);

  const isMainModalOpen = isOpen || isInternalOpen;

  const stepState = usePaymentFlowModalState({
    isOpen: isMainModalOpen,
    invoiceId,
    memberId,
    fetch,
    onClose: () => {
      setIsInternalOpen(false);
      onClose();
    },
    onConfirm: (remainingAmountCts) => {
      onConfirm?.(remainingAmountCts);
      if (remainingAmountCts > 0) {
        shouldDismissFlowOnPartialSuccessCloseRef.current = true;
        setPartialSuccessRemainingAmountCts(remainingAmountCts);
        setIsPartialSuccessOpen(true);
      }
    },
    companyTheme,
  });

  const {
    formId,
    closeModal,
    isConfirmDisabled,
    isConfirmLoading,
    confirmAmountCts,
  } = stepState;

  const confirmLabel = useMemo(() => {
    if (confirmAmountCts <= 0) return t("paymentFlowModal.buttons.confirm");
    const price = getCurrencyDisplayWithPrice(confirmAmountCts / 100).replace(
      /([,.]00)(?=\s?[^\d\s]+$)/,
      "",
    );
    return t("paymentFlowModal.buttons.pay", { amount: price });
  }, [confirmAmountCts, t]);
  const remainingAmountLabel = getCurrencyDisplayWithPrice(
    partialSuccessRemainingAmountCts / 100,
  ).replace(/([,.]00)(?=\s?[^\d\s]+$)/, "");
  const closePartialSuccessModal = ({
    dismissFlowOnTransitionEnd = true,
  }: {
    dismissFlowOnTransitionEnd?: boolean;
  } = {}) => {
    shouldDismissFlowOnPartialSuccessCloseRef.current =
      dismissFlowOnTransitionEnd;
    setIsPartialSuccessOpen(false);
    setPartialSuccessRemainingAmountCts(0);
  };
  const dismissPartialSuccessFlow = useCallback(() => {
    shouldDismissFlowOnPartialSuccessCloseRef.current = false;
    setIsPartialSuccessOpen(false);
    setPartialSuccessRemainingAmountCts(0);
    setIsInternalOpen(false);
    onClose();
  }, [onClose]);
  const handlePartialSuccessClose = useCallback(() => {
    if (!shouldDismissFlowOnPartialSuccessCloseRef.current) {
      return;
    }

    dismissPartialSuccessFlow();
  }, [dismissPartialSuccessFlow]);

  const allowMainModalClose = isMainModalOpen && !isPartialSuccessOpen;

  const { handleCancelClose, handleClickOutside, handleCrossClick } =
    useGuardedModalClose({
      skipEscapeListener: !allowMainModalClose,
      shouldGuard: false,
      close: closeModal,
    });

  return (
    <>
      <Modal
        open={allowMainModalClose}
        title={t("paymentFlowModal.title")}
        size="lg"
        cancelButton={{
          label: t("paymentFlowModal.buttons.cancel"),
          onClick: handleCancelClose,
        }}
        confirmButton={{
          label: confirmLabel,
          color: "main",
          type: "submit",
          form: formId,
          disabled: isConfirmDisabled,
          loading: isConfirmLoading,
        }}
        onCloseButtonClick={handleCrossClick}
        onClickOutside={handleClickOutside}
      >
        <PaymentFlowStep stepState={stepState} />
      </Modal>

      <PartialSuccessModal
        isOpen={isPartialSuccessOpen}
        remainingAmountLabel={remainingAmountLabel}
        onClose={handlePartialSuccessClose}
        onCloseButtonClick={dismissPartialSuccessFlow}
        onPayRemainingAmount={async () => {
          try {
            const freshInvoice = await fetchInvoiceAPI(fetch, invoiceId);
            queryClient.setQueryData(
              invoiceKeys.detail(invoiceId),
              freshInvoice,
            );
            closePartialSuccessModal({
              dismissFlowOnTransitionEnd: false,
            });
            setIsInternalOpen(true);
          } catch {
            toast({
              status: "critical",
              title: t("paymentFlowModal.errors.generic"),
              icon: "alert-circle",
            });
          }
        }}
      />
    </>
  );
};

PaymentFlowModal.displayName = "KaizenPaymentFlowModal";
