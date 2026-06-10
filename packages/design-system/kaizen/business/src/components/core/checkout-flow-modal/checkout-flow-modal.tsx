import React from "react";

import { Modal } from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import { CheckoutFlowStepContent } from "./checkout-flow-step-content";
import type { CheckoutFlowModalProps } from "./types";
import { useCheckoutFlowStep } from "./use-checkout-flow-step";

/**
 * Modal to build an invoice (add items, member, promo codes) and create it via API.
 *
 * `openCheckoutFlow` and `CheckoutFlowModal` are complementary:
 * - call `openCheckoutFlow` from any consuming page to set checkout query params
 * - render `CheckoutFlowModal` from an integration container (e.g. navigation sidebar)
 *   that listens to URL state and mounts the modal in a portal
 *
 * @param companyId - Company for config and invoice creation
 * @param fetch - Instance of the @bsport/fetch library
 * @param isOpen - When false, modal is not rendered
 * @param memberId - Optional pre-selected member; omit when user picks (e.g. "Sell products")
 * @param onClose - Called when user closes the modal
 * @param onError - Use for side-effects only (logging, analytics). Component already shows an error toast.
 * @param onSubmit - Called on success with form data and invoice UUID
 * @param onTrack - Track function to emit checkout flow events
 * @param startContext - Optional context for how the flow was opened (navbar, member profile, offer page)
 * @param basketSessionId - Optional pre-generated basket session ID; one is generated when the modal opens if not provided
 */
export const CheckoutFlowModal: React.FC<CheckoutFlowModalProps> = ({
  companyId,
  fetch,
  isOpen,
  memberId,
  onClose,
  onError,
  onSubmit,
  onTrack,
  startContext,
  basketSessionId: externalBasketSessionId,
}: CheckoutFlowModalProps) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });

  const stepState = useCheckoutFlowStep({
    companyId,
    fetch,
    isActive: isOpen,
    memberId,
    onClose,
    onError,
    onInvoiceCreated: (invoiceUuid, _memberId, data) => {
      onSubmit?.(data, invoiceUuid);
    },
    onTrack,
    startContext,
    basketSessionId: externalBasketSessionId,
  });

  const {
    formId,
    isConfirmDisabled,
    handleCancelClose,
    handleClickOutside,
    handleCrossClick,
  } = stepState;

  return (
    <Modal
      open={isOpen}
      size="lg"
      className="h-[90%]"
      title={t("checkoutFlowModal.title")}
      onCloseButtonClick={handleCrossClick}
      onClickOutside={handleClickOutside}
      confirmButton={{
        color: "main",
        label: t("checkoutFlowModal.payNow"),
        type: "submit",
        form: formId,
        disabled: isConfirmDisabled,
      }}
      cancelButton={{
        label: t("checkoutFlowModal.cancel"),
        onClick: handleCancelClose,
      }}
    >
      <CheckoutFlowStepContent
        companyId={companyId}
        fetch={fetch}
        {...stepState}
      />
    </Modal>
  );
};
