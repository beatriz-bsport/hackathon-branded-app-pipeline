import { toast } from "@bsport/kaizen-primitive-core";

import { i18nInstance, i18nNamespacePrefix } from "#src/i18n";

const CORE_NS = `${i18nNamespacePrefix}_core`;

const getInvoiceDetailsUrl = (invoiceId: string) => `/invoice/${invoiceId}`;

/** Toast shown when checkout creates an invoice but payment is deferred. */
export const showInvoicePendingPaymentToast = (invoiceId: string) => {
  toast({
    status: "default",
    title: i18nInstance.t("checkoutFlowModal.toasts.invoicePendingPayment", {
      ns: CORE_NS,
    }),
    icon: "credit-card-search",
    buttonLabel: i18nInstance.t("checkoutFlowModal.toasts.invoiceAction", {
      ns: CORE_NS,
    }),
    onButtonClick: () => {
      if (typeof window === "undefined") return;
      window.location.assign(getInvoiceDetailsUrl(invoiceId));
    },
  });
};
