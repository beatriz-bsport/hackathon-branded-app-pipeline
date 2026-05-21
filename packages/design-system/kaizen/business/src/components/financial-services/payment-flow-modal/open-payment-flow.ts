import {
  HOST_WINDOW_EVENTS,
  PAYMENT_FLOW_SEARCH_PARAMS,
} from "./payment-flow-integration";

type OpenPaymentFlowArgs = {
  invoiceId: string;
  memberId: number;
  pathname?: string;
  search?: string;
  navigate?: (path: string) => void;
};

/**
 * Opens the payment flow by adding the expected query params.
 *
 * This helper can be called from any consuming page.
 * A separate integration container is responsible for rendering `PaymentFlowModal`
 * when `pfOpen` is present in the URL.
 *
 * By default this updates browser history and dispatches the "navigation" event expected
 * by host applications. Consumers can pass a custom `navigate` callback (e.g. react-router's
 * push) to control navigation.
 */
export const openPaymentFlow = ({
  invoiceId,
  memberId,
  pathname,
  search,
  navigate,
}: OpenPaymentFlowArgs): string => {
  const currentPathname =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
  const currentSearch =
    search ?? (typeof window !== "undefined" ? window.location.search : "");
  const params = new URLSearchParams(currentSearch);

  params.set(PAYMENT_FLOW_SEARCH_PARAMS.open, "");
  params.set(PAYMENT_FLOW_SEARCH_PARAMS.invoiceId, invoiceId);
  params.set(PAYMENT_FLOW_SEARCH_PARAMS.memberId, String(memberId));

  const nextSearch = params.toString();
  const nextPath = currentPathname + (nextSearch ? `?${nextSearch}` : "");

  if (navigate) {
    // When pathname is not provided, update only the search part so router basenames
    // (e.g. "/studio" in deployed environments) are not duplicated.
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
