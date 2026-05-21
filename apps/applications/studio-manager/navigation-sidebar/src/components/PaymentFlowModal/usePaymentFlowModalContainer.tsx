import { useCallback, useEffect, useState } from "react";

import type { Fetch } from "@bsport/fetch";
import {
  PAYMENT_FLOW_SEARCH_PARAMS,
  PAYMENT_FLOW_WINDOW_EVENTS,
  PaymentFlowModal,
} from "@bsport/kaizen-business-components/financial-services/payment-flow-modal";

import { WINDOW_EVENTS } from "#src/constants/window-events";
import { useCurrentSearch } from "#src/hooks/use-current-search";
import { NavFlags, useNavFlag } from "#src/utils/featureFlags";

import { PaymentFlowModalQueryClientProvider } from "./PaymentFlowModalQueryClientProvider";

type PaymentFlowSession = {
  invoiceId: string;
  memberId: number;
};

type UsePaymentFlowModalContainerArgs = {
  fetch: Fetch;
};

/**
 * Encapsulates payment flow modal state, URL-driven open, and render.
 *
 * - **Open from URL**: when `pfOpen`, `invoiceId` and `memberId` are in the query
 *   string (e.g. invoice detail "Bill"), the modal opens.
 *
 * - **On close**: pfOpen, invoiceId and memberId are removed from the URL.
 *
 * - **Partial payment**: URL params and the mounted session are kept until the user
 *   dismisses the partial-success step or completes the remaining balance.
 *
 * Renders nothing when the feature is disabled or the flow session has ended.
 * The returned `paymentFlowModalElement` should be rendered in the tree (e.g. from the sidebar).
 */
export function usePaymentFlowModalContainer({
  fetch,
}: UsePaymentFlowModalContainerArgs) {
  const isEnabled = useNavFlag(NavFlags.FS_PAYMENT_FLOW_MODAL);
  const searchString = useCurrentSearch();
  const params = new URLSearchParams(searchString);
  const hasPfOpen = params.has(PAYMENT_FLOW_SEARCH_PARAMS.open);
  const invoiceIdParam = params.get(PAYMENT_FLOW_SEARCH_PARAMS.invoiceId);
  const memberIdParam = params.get(PAYMENT_FLOW_SEARCH_PARAMS.memberId);

  const parsedMemberId =
    memberIdParam != null && memberIdParam !== ""
      ? parseInt(memberIdParam, 10)
      : undefined;
  const paymentFlowMemberIdFromUrl =
    parsedMemberId != null && !Number.isNaN(parsedMemberId)
      ? parsedMemberId
      : undefined;
  const paymentFlowInvoiceIdFromUrl =
    invoiceIdParam != null && invoiceIdParam !== ""
      ? invoiceIdParam
      : undefined;

  const hasRequiredParams =
    paymentFlowInvoiceIdFromUrl != null && paymentFlowMemberIdFromUrl != null;

  const [paymentSession, setPaymentSession] =
    useState<PaymentFlowSession | null>(null);

  useEffect(() => {
    if (isEnabled && hasPfOpen && hasRequiredParams) {
      setPaymentSession({
        invoiceId: paymentFlowInvoiceIdFromUrl,
        memberId: paymentFlowMemberIdFromUrl,
      });
    }
  }, [
    isEnabled,
    hasPfOpen,
    hasRequiredParams,
    paymentFlowInvoiceIdFromUrl,
    paymentFlowMemberIdFromUrl,
  ]);

  const clearPaymentFlowFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    params.delete(PAYMENT_FLOW_SEARCH_PARAMS.open);
    params.delete(PAYMENT_FLOW_SEARCH_PARAMS.invoiceId);
    params.delete(PAYMENT_FLOW_SEARCH_PARAMS.memberId);
    const search = params.toString();
    const path = window.location.pathname + (search ? `?${search}` : "");
    window.history.replaceState(null, "", path);
    window.dispatchEvent(
      new CustomEvent(WINDOW_EVENTS.navigation, { detail: { path } }),
    );
  }, []);

  const handlePaymentFlowClose = useCallback(() => {
    setPaymentSession(null);
    clearPaymentFlowFromUrl();
  }, [clearPaymentFlowFromUrl]);

  const handlePaymentFlowConfirm = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(PAYMENT_FLOW_WINDOW_EVENTS.confirmed),
      );
    }
  }, []);

  const paymentFlowModalElement =
    isEnabled && paymentSession != null ? (
      <PaymentFlowModalQueryClientProvider>
        <PaymentFlowModal
          fetch={fetch}
          invoiceId={paymentSession.invoiceId}
          isOpen
          memberId={paymentSession.memberId}
          onClose={handlePaymentFlowClose}
          onConfirm={handlePaymentFlowConfirm}
        />
      </PaymentFlowModalQueryClientProvider>
    ) : null;

  return { paymentFlowModalElement };
}
