import {
  CHECKOUT_FLOW_SEARCH_PARAMS,
  FULL_PAYMENT_FLOW_SEARCH_PARAMS,
  HOST_WINDOW_EVENTS,
} from "./constants";
import type { FullPaymentFlowBasketStartTrigger } from "./types";

type OpenFullPaymentFlowArgs = {
  basketStartTrigger: FullPaymentFlowBasketStartTrigger;
  memberId?: number;
  pathname?: string;
  search?: string;
  navigate?: (path: string) => void;
};

/**
 * Opens the combined checkout → payment flow via URL.
 *
 * Sets `pfOpen`, optional `memberId`, and `cfTrigger` (basket start metadata).
 * Does not set `invoiceId`, the shell starts on checkout and transitions in place
 * after invoice creation. Host containers should use `mode: "full"` when these params
 * are present without `invoiceId`.
 *
 * Clears checkout-only params (`cfOpen`) so a single modal host is active.
 */
export const openFullPaymentFlow = ({
  basketStartTrigger,
  memberId,
  pathname,
  search,
  navigate,
}: OpenFullPaymentFlowArgs): string => {
  const currentPathname =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
  const currentSearch =
    search ?? (typeof window !== "undefined" ? window.location.search : "");
  const params = new URLSearchParams(currentSearch);

  params.delete(CHECKOUT_FLOW_SEARCH_PARAMS.open);
  params.set(FULL_PAYMENT_FLOW_SEARCH_PARAMS.open, "");
  params.set(FULL_PAYMENT_FLOW_SEARCH_PARAMS.trigger, basketStartTrigger);

  if (memberId == null) {
    params.delete(FULL_PAYMENT_FLOW_SEARCH_PARAMS.memberId);
  } else {
    params.set(FULL_PAYMENT_FLOW_SEARCH_PARAMS.memberId, String(memberId));
  }

  params.delete(FULL_PAYMENT_FLOW_SEARCH_PARAMS.invoiceId);

  const nextSearch = params.toString();
  const nextPath = currentPathname + (nextSearch ? `?${nextSearch}` : "");

  if (navigate) {
    const navigationTarget =
      pathname == null ? (nextSearch ? `?${nextSearch}` : "") : nextPath;

    navigate(navigationTarget);
    return nextPath;
  }

  if (typeof window !== "undefined") {
    window.history.pushState(null, "", nextPath);
    window.dispatchEvent(
      new CustomEvent(HOST_WINDOW_EVENTS.navigation, {
        detail: { path: nextPath },
      }),
    );
  }

  return nextPath;
};
