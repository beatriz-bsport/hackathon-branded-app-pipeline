import React from "react";

import { ControlledForm } from "@bsport/form";

import { PaymentFlowModalBody } from "./components/payment-flow-modal-body";
import type { usePaymentFlowModalState } from "./hooks/use-payment-flow-modal-state";

export type PaymentFlowStepState = ReturnType<typeof usePaymentFlowModalState>;

type PaymentFlowStepProps = {
  stepState: PaymentFlowStepState;
};

/**
 * Payment step content (form + body). The host calls `usePaymentFlowModalState`
 * and owns modal chrome / footer actions.
 */
export const PaymentFlowStep: React.FC<PaymentFlowStepProps> = ({
  stepState,
}) => {
  const { methods, formId, handleSubmit, body } = stepState;

  return (
    <ControlledForm
      {...methods}
      id={formId}
      onSubmit={handleSubmit}
      className="flex flex-col gap-md"
    >
      <PaymentFlowModalBody body={body} />
    </ControlledForm>
  );
};
