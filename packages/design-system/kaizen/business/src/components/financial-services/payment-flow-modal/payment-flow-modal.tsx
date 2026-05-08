import React from "react";

import { ControlledForm } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import { usePaymentFlowModalState } from "./hooks/use-payment-flow-modal-state";
import { PaymentFlowModalBody } from "./payment-flow-modal-body";
import type { PaymentFlowModalProps } from "./types";

export const PaymentFlowModal: React.FC<PaymentFlowModalProps> = ({
  isOpen,
  invoiceId,
  memberId,
  fetch,
  onClose,
  onConfirm,
}: PaymentFlowModalProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });

  const {
    methods,
    formId,
    handleSubmit,
    isConfirmDisabled,
    isConfirmLoading,
    body,
  } = usePaymentFlowModalState({
    isOpen,
    invoiceId,
    memberId,
    fetch,
    onClose,
    onConfirm,
  });

  return (
    <Modal
      open={isOpen}
      title={t("paymentFlowModal.title")}
      size="lg"
      onClose={onClose}
      cancelButton={{
        label: t("paymentFlowModal.buttons.cancel"),
        onClick: onClose,
      }}
      confirmButton={{
        label: t("paymentFlowModal.buttons.confirm"),
        color: "main",
        type: "submit",
        form: formId,
        disabled: isConfirmDisabled,
        loading: isConfirmLoading,
      }}
      onCloseButtonClick={onClose}
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
  );
};

PaymentFlowModal.displayName = "KaizenPaymentFlowModal";
