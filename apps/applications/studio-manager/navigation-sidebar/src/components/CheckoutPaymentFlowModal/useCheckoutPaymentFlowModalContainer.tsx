import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Fetch } from "@bsport/fetch";
import {
  type CheckoutFlowFormData,
  openCheckoutFlow,
} from "@bsport/kaizen-business-components/core/checkout-flow-modal";
import {
  CHECKOUT_FLOW_SEARCH_PARAMS,
  CHECKOUT_PAYMENT_FLOW_MODE,
  CheckoutPaymentFlowModal,
  type CheckoutPaymentFlowMode,
  FULL_PAYMENT_FLOW_SEARCH_PARAMS,
  PAYMENT_FLOW_SEARCH_PARAMS,
  PAYMENT_FLOW_WINDOW_EVENTS,
  openFullPaymentFlow,
} from "@bsport/kaizen-business-components/financial-services/checkout-payment-flow-modal";
import { toast } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { WINDOW_EVENTS } from "#src/constants/window-events";
import { useCurrentSearch } from "#src/hooks/use-current-search";
import { LEGACY_URLS } from "#src/urls";
import { analyticsClient } from "#src/utils/analytics";
import { NavFlags, useNavFlag } from "#src/utils/featureFlags";
import { TFunction } from "#src/utils/i18n";

import { CheckoutPaymentFlowQueryClientProvider } from "./CheckoutPaymentFlowQueryClientProvider";
import {
  type FlowSessionFromUrl,
  resolveFlowSessionFromUrl,
} from "./resolveFlowSessionFromUrl";

type ActiveFlowSession = FlowSessionFromUrl & {
  invoiceId?: string;
};

type UseCheckoutPaymentFlowModalContainerArgs = {
  companyId: number | undefined | null;
  fetch: Fetch;
  navigateInContext: (to: string, isRevamped?: boolean) => void;
  t: TFunction;
};

function isFlowEnabled(
  mode: CheckoutPaymentFlowMode,
  isBillingEnabled: boolean,
  isPaymentEnabled: boolean,
): boolean {
  switch (mode) {
    case CHECKOUT_PAYMENT_FLOW_MODE.CHECKOUT:
      return isBillingEnabled;
    case CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT:
      return isPaymentEnabled;
    case CHECKOUT_PAYMENT_FLOW_MODE.FULL:
      return isBillingEnabled && isPaymentEnabled;
    default:
      return false;
  }
}

function replaceUrlSearch(params: URLSearchParams) {
  const search = params.toString();
  const path = window.location.pathname + (search ? `?${search}` : "");
  window.history.replaceState(null, "", path);
  window.dispatchEvent(
    new CustomEvent(WINDOW_EVENTS.navigation, { detail: { path } }),
  );
}

/**
 * Single host for checkout-only, payment-only, and full checkout→payment flows.
 *
 * - **Checkout-only** (`cfOpen`): toast + close on invoice create (e.g. bill member from profile).
 * - **Navbar "Quick sell"**: full flow when payment flag is on (`pfOpen` without `invoiceId`).
 * - **Payment-only** (`pfOpen` + `invoiceId` + `memberId`): pay existing invoice.
 * - **Full** (`pfOpen` without `invoiceId`): in-place checkout → payment; URL gains `invoiceId` on transition.
 */
export function useCheckoutPaymentFlowModalContainer({
  companyId,
  fetch,
  navigateInContext,
  t,
}: UseCheckoutPaymentFlowModalContainerArgs) {
  const isBillingEnabled = useNavFlag(NavFlags.FS_BILLING_FLOW_NEW_MODAL);
  const isPaymentEnabled = useNavFlag(NavFlags.FS_PAYMENT_FLOW_MODAL);
  const searchString = useCurrentSearch();
  const params = useMemo(
    () => new URLSearchParams(searchString),
    [searchString],
  );

  const urlSession = useMemo(() => resolveFlowSessionFromUrl(params), [params]);

  const [activeSession, setActiveSession] = useState<ActiveFlowSession | null>(
    null,
  );
  const activeSessionRef = useRef<ActiveFlowSession | null>(null);
  activeSessionRef.current = activeSession;

  useEffect(() => {
    if (urlSession == null) {
      setActiveSession(null);
      return;
    }

    if (!isFlowEnabled(urlSession.mode, isBillingEnabled, isPaymentEnabled)) {
      setActiveSession(null);
      return;
    }

    setActiveSession((previous) => {
      if (
        previous?.mode === CHECKOUT_PAYMENT_FLOW_MODE.FULL &&
        urlSession.mode === CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT &&
        urlSession.invoiceId != null &&
        urlSession.memberId != null
      ) {
        return {
          mode: CHECKOUT_PAYMENT_FLOW_MODE.FULL,
          memberId: urlSession.memberId,
          invoiceId: urlSession.invoiceId,
          basketStartTrigger:
            previous?.basketStartTrigger ?? urlSession.basketStartTrigger,
        };
      }

      return {
        ...urlSession,
        invoiceId: urlSession.invoiceId ?? previous?.invoiceId,
      };
    });
  }, [urlSession, isBillingEnabled, isPaymentEnabled]);

  const clearCheckoutParams = useCallback((params: URLSearchParams) => {
    params.delete(CHECKOUT_FLOW_SEARCH_PARAMS.open);
    params.delete(CHECKOUT_FLOW_SEARCH_PARAMS.trigger);
    params.delete(CHECKOUT_FLOW_SEARCH_PARAMS.memberId);
  }, []);

  const clearPaymentParams = useCallback((params: URLSearchParams) => {
    params.delete(PAYMENT_FLOW_SEARCH_PARAMS.open);
    params.delete(PAYMENT_FLOW_SEARCH_PARAMS.invoiceId);
    params.delete(PAYMENT_FLOW_SEARCH_PARAMS.memberId);
    params.delete(FULL_PAYMENT_FLOW_SEARCH_PARAMS.trigger);
  }, []);

  const handleClose = useCallback(() => {
    setActiveSession(null);

    if (typeof window === "undefined") return;

    const nextParams = new URLSearchParams(window.location.search);
    clearCheckoutParams(nextParams);
    clearPaymentParams(nextParams);
    replaceUrlSearch(nextParams);
  }, [clearCheckoutParams, clearPaymentParams]);

  const openCheckoutModalFromNav = useCallback(() => {
    if (!isBillingEnabled || typeof window === "undefined") return;

    if (isPaymentEnabled) {
      openFullPaymentFlow({ basketStartTrigger: "navbar" });
      return;
    }

    openCheckoutFlow({ basketStartTrigger: "navbar" });
  }, [isBillingEnabled, isPaymentEnabled]);

  const handleCheckoutComplete = useCallback(
    (_data: CheckoutFlowFormData, invoiceUuid: string) => {
      toast({
        status: "positive",
        icon: "check",
        title: t("checkoutFlowModal.toasts.invoiceCreated"),
        buttonLabel: t("checkoutFlowModal.toasts.open"),
        onButtonClick: () =>
          navigateInContext(`${LEGACY_URLS.invoice}/${invoiceUuid}`, false),
      });
      handleClose();
    },
    [handleClose, navigateInContext, t],
  );

  const handleTransitionToPayment = useCallback(
    (invoiceId: string, memberId: number) => {
      if (typeof window === "undefined") return;

      const nextParams = new URLSearchParams(window.location.search);
      clearCheckoutParams(nextParams);
      nextParams.set(PAYMENT_FLOW_SEARCH_PARAMS.open, "");
      nextParams.set(PAYMENT_FLOW_SEARCH_PARAMS.invoiceId, invoiceId);
      nextParams.set(PAYMENT_FLOW_SEARCH_PARAMS.memberId, String(memberId));
      replaceUrlSearch(nextParams);
    },
    [clearCheckoutParams],
  );

  const handlePaymentConfirm = useCallback(() => {
    const session = activeSessionRef.current;
    if (
      typeof window === "undefined" ||
      session == null ||
      session.memberId == null ||
      session.invoiceId == null
    ) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent(PAYMENT_FLOW_WINDOW_EVENTS.confirmed, {
        detail: {
          memberId: session.memberId,
          invoiceId: session.invoiceId,
        },
      }),
    );
  }, []);

  const companyTheme = dataAccessLayer.useCompanyTheme();

  const checkoutStartContext = useMemo(
    () => ({
      basket_start_trigger:
        activeSession?.basketStartTrigger ?? ("navbar" as const),
      ...(typeof window !== "undefined" && {
        origin_url: window.location.href,
      }),
    }),
    [activeSession?.basketStartTrigger],
  );

  const modalProps = useMemo(() => {
    if (!activeSession || !companyId) {
      return null;
    }

    const base = {
      isOpen: true,
      companyId,
      fetch,
      onClose: handleClose,
      onTrack: (eventName: string, properties: Record<string, unknown>) =>
        analyticsClient.track({ eventType: eventName, ...properties }),
      startContext: checkoutStartContext,
      companyTheme: companyTheme ?? undefined,
    };

    switch (activeSession.mode) {
      case CHECKOUT_PAYMENT_FLOW_MODE.CHECKOUT:
        return {
          ...base,
          mode: CHECKOUT_PAYMENT_FLOW_MODE.CHECKOUT,
          memberId: activeSession.memberId,
          onCheckoutComplete: handleCheckoutComplete,
        };
      case CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT:
        if (activeSession.invoiceId == null || activeSession.memberId == null) {
          return null;
        }
        return {
          ...base,
          mode: CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT,
          invoiceId: activeSession.invoiceId,
          memberId: activeSession.memberId,
          onPaymentConfirm: handlePaymentConfirm,
        };
      case CHECKOUT_PAYMENT_FLOW_MODE.FULL:
        return {
          ...base,
          mode: CHECKOUT_PAYMENT_FLOW_MODE.FULL,
          memberId: activeSession.memberId,
          invoiceId: activeSession.invoiceId,
          onTransitionToPayment: handleTransitionToPayment,
          onPaymentConfirm: handlePaymentConfirm,
        };
      default:
        return null;
    }
  }, [
    activeSession,
    companyId,
    companyTheme,
    fetch,
    handleCheckoutComplete,
    handleClose,
    handlePaymentConfirm,
    handleTransitionToPayment,
    checkoutStartContext,
  ]);

  const needsCompanyTheme =
    activeSession?.mode === CHECKOUT_PAYMENT_FLOW_MODE.PAYMENT ||
    activeSession?.mode === CHECKOUT_PAYMENT_FLOW_MODE.FULL;

  const checkoutPaymentFlowModalElement =
    modalProps != null && (!needsCompanyTheme || companyTheme != null) ? (
      <CheckoutPaymentFlowQueryClientProvider>
        <CheckoutPaymentFlowModal {...modalProps} />
      </CheckoutPaymentFlowQueryClientProvider>
    ) : null;

  return {
    openCheckoutModalFromNav,
    checkoutPaymentFlowModalElement,
  };
}
