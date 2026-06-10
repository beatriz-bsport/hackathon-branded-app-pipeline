import React from "react";

import { Modal } from "@bsport/kaizen-primitive-core";

import { CheckoutFlowStepContent } from "#src/components/core/checkout-flow-modal/checkout-flow-step-content";
import { PartialSuccessModal } from "#src/components/financial-services/payment-flow-modal/components/partial-success-modal";
import { PaymentFlowStep } from "#src/components/financial-services/payment-flow-modal/payment-flow-step";

import {
  CHECKOUT_PAYMENT_FLOW_PHASE,
  type CheckoutPaymentFlowModalProps,
} from "./types";
import { useCheckoutPaymentFlowState } from "./use-checkout-payment-flow-state";

/**
 * Unified checkout + payment shell: one `Modal`, one active step at a time.
 *
 * Use `mode` to control behavior:
 * - `checkout`: invoice creation then `onCheckoutComplete` (host closes)
 * - `payment`: pay an existing invoice (`invoiceId` + `memberId` required)
 * - `full`: checkout → payment in place; call `onTransitionToPayment` to sync URL
 */
export const CheckoutPaymentFlowModal: React.FC<
  CheckoutPaymentFlowModalProps
> = (props) => {
  const state = useCheckoutPaymentFlowState(props);

  return (
    <>
      <Modal
        open={state.isMainModalOpen}
        size="lg"
        className={state.isCheckoutPhase ? "h-[90%]" : undefined}
        title={state.modalTitle}
        onCloseButtonClick={state.onCloseButtonClick}
        onClickOutside={state.onClickOutside}
        confirmButton={state.footer?.confirmButton}
        cancelButton={state.footer?.cancelButton}
      >
        {state.phase === CHECKOUT_PAYMENT_FLOW_PHASE.CHECKOUT ? (
          <CheckoutFlowStepContent
            companyId={props.companyId}
            fetch={props.fetch}
            {...state.checkoutStep}
          />
        ) : state.isPaymentStepActive ? (
          <PaymentFlowStep stepState={state.paymentStep} />
        ) : null}
      </Modal>

      <PartialSuccessModal
        isOpen={state.partialSuccess.isOpen}
        remainingAmountLabel={state.partialSuccess.remainingAmountLabel}
        onClose={state.partialSuccess.onClose}
        onCloseButtonClick={state.partialSuccess.onCloseButtonClick}
        onPayRemainingAmount={state.partialSuccess.onPayRemainingAmount}
      />
    </>
  );
};

CheckoutPaymentFlowModal.displayName = "KaizenCheckoutPaymentFlowModal";
