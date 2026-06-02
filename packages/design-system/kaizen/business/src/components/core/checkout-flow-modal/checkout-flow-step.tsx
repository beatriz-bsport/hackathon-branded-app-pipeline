import React from "react";

import { CheckoutFlowStepContent } from "./checkout-flow-step-content";
import type { CheckoutFlowStepProps } from "./types";
import { useCheckoutFlowStep } from "./use-checkout-flow-step";

/**
 * Checkout step content: member card, add-item, summary, footnote/member-selector
 * sub-modals, and invoice creation form. Use inside a shell (e.g. a unified flow modal)
 * that owns outer modal chrome and footer actions.
 */
export const CheckoutFlowStep: React.FC<CheckoutFlowStepProps> = (props) => {
  const stepState = useCheckoutFlowStep(props);

  return (
    <CheckoutFlowStepContent
      companyId={props.companyId}
      fetch={props.fetch}
      {...stepState}
    />
  );
};
