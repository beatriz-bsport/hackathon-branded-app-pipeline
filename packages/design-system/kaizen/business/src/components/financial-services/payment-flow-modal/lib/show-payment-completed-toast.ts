import { toast } from "@bsport/kaizen-primitive-core";

import { i18nInstance, i18nNamespacePrefix } from "#src/i18n";

const FINANCIAL_SERVICES_NS = `${i18nNamespacePrefix}_financial-services`;

/** Success toast shown when an invoice is fully paid through the payment flow. */
export const showPaymentCompletedToast = () => {
  toast({
    status: "default",
    title: i18nInstance.t("paymentFlowModal.toasts.paymentCompleted", {
      ns: FINANCIAL_SERVICES_NS,
    }),
    icon: "credit-card-check",
  });
};
