import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";

import {
  fetchInvoiceAPI,
  invoiceKeys,
} from "@bsport/api-financial-services/invoice";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { ControlledForm } from "@bsport/form";
import { Modal, toast } from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import { PartialSuccessModal } from "./components/partial-success-modal";
import { PaymentFlowModalBody } from "./components/payment-flow-modal-body";
import { usePaymentFlowModalState } from "./hooks/use-payment-flow-modal-state";
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
  const [
    partialSuccessRemainingAmountCts,
    setPartialSuccessRemainingAmountCts,
  ] = useState(0);

  const {
    methods,
    formId,
    handleSubmit,
    isConfirmDisabled,
    isConfirmLoading,
    confirmAmountCts,
    body,
  } = usePaymentFlowModalState({
    isOpen: isOpen || isInternalOpen,
    invoiceId,
    memberId,
    fetch,
    onClose: () => {
      setIsInternalOpen(false);
      onClose();
    },
    onConfirm: (remainingAmountCts) => {
      onConfirm?.();
      if (remainingAmountCts > 0) {
        setPartialSuccessRemainingAmountCts(remainingAmountCts);
        setIsPartialSuccessOpen(true);
      }
    },
    companyTheme,
  });

  const isMainModalOpen = isOpen || isInternalOpen;
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
  const closePartialSuccessModal = () => {
    setIsPartialSuccessOpen(false);
    setPartialSuccessRemainingAmountCts(0);
  };

  return (
    <>
      <Modal
        open={isMainModalOpen}
        title={t("paymentFlowModal.title")}
        size="lg"
        onClose={() => {
          setIsInternalOpen(false);
          onClose();
        }}
        cancelButton={{
          label: t("paymentFlowModal.buttons.cancel"),
          onClick: () => {
            setIsInternalOpen(false);
            onClose();
          },
        }}
        confirmButton={{
          label: confirmLabel,
          color: "main",
          type: "submit",
          form: formId,
          disabled: isConfirmDisabled,
          loading: isConfirmLoading,
        }}
        onCloseButtonClick={() => {
          setIsInternalOpen(false);
          onClose();
        }}
      >
        <ControlledForm
          {...methods}
          id={formId}
          onSubmit={handleSubmit}
          className="flex flex-col gap-md"
        >
          <PaymentFlowModalBody body={body} />
        </ControlledForm>
      </Modal>

      <PartialSuccessModal
        isOpen={isPartialSuccessOpen}
        remainingAmountLabel={remainingAmountLabel}
        onClose={closePartialSuccessModal}
        onPayRemainingAmount={async () => {
          try {
            const freshInvoice = await fetchInvoiceAPI(fetch, invoiceId);
            queryClient.setQueryData(
              invoiceKeys.detail(invoiceId),
              freshInvoice,
            );
            closePartialSuccessModal();
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
