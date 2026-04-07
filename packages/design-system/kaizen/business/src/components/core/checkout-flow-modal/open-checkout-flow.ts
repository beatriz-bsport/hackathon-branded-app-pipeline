import type { CheckoutFlowStartContext } from "./types";

type OpenCheckoutFlowArgs = {
  basketStartTrigger: CheckoutFlowStartContext["basket_start_trigger"];
  memberId?: number;
  pathname?: string;
  search?: string;
  navigate?: (path: string) => void;
};

/**
 * Opens the checkout flow by adding the expected query params.
 *
 * This helper can be called from any consuming page (e.g. member detail).
 * A separate integration container is responsible for rendering `CheckoutFlowModal`
 * when `cfOpen` is present in the URL.
 *
 * By default this updates browser history and dispatches the "navigation" event expected
 * by host applications. Consumers can pass a custom `navigate` callback (e.g. react-router's
 * push) to control navigation.
 */
export const openCheckoutFlow = ({
  basketStartTrigger,
  memberId,
  pathname,
  search,
  navigate,
}: OpenCheckoutFlowArgs): string => {
  const currentPathname =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
  const currentSearch =
    search ?? (typeof window !== "undefined" ? window.location.search : "");
  const params = new URLSearchParams(currentSearch);

  params.set("cfOpen", "");
  params.set("cfTrigger", basketStartTrigger);

  if (memberId == null) {
    params.delete("memberId");
  } else {
    params.set("memberId", String(memberId));
  }

  const nextSearch = params.toString();
  const nextPath = currentPathname + (nextSearch ? `?${nextSearch}` : "");

  if (navigate) {
    navigate(nextPath);
    return nextPath;
  }

  if (typeof window !== "undefined") {
    window.history.pushState(null, "", nextPath);
    window.dispatchEvent(
      new CustomEvent("navigation", { detail: { path: nextPath } }),
    );
  }

  return nextPath;
};
