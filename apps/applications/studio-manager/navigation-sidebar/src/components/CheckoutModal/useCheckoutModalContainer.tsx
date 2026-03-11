import { useCallback } from "react";

import type { Fetch } from "@bsport/fetch";
import {
  CheckoutFlowModal,
  type CheckoutFlowStartContext,
} from "@bsport/kaizen-business-components/core/checkout-flow-modal";
import { toast } from "@bsport/kaizen-primitive-core";

import { BASKET_START_TRIGGERS } from "#src/events/register";
import { LEGACY_URLS } from "#src/urls";
import { analyticsClient } from "#src/utils/analytics";
import { NavFlags, useNavFlag } from "#src/utils/featureFlags";
import { TFunction } from "#src/utils/i18n";

import { CheckoutModalQueryClientProvider } from "./CheckoutModalQueryClientProvider";

type BasketStartTrigger = (typeof BASKET_START_TRIGGERS)[number];

function parseCfTrigger(value: string | null): BasketStartTrigger {
  const isValid =
    value != null && BASKET_START_TRIGGERS.some((trigger) => trigger === value);

  if (!isValid) return "navbar";

  return value as BasketStartTrigger;
}

type UseCheckoutModalContainerArgs = {
  companyId: number | undefined | null;
  fetch: Fetch;
  navigateInContext: (to: string, isRevamped?: boolean) => void;
  t: TFunction;
};

/**
 * Encapsulates checkout flow modal state, URL-driven open, and render.
 *
 * - **Open from nav**: use `openCheckoutModalFromNav` (e.g. "Sell products" item) to open
 *   with no pre-selected member. Sets cfOpen and cfTrigger=navbar.
 * - **Open from URL**: when `cfOpen` and optional `cfTrigger` and `memberId` are in the query
 *   string (e.g. member detail "Bill" with cfTrigger=member_profile_page), the modal opens.
 *
 * - **On close**: cfOpen, cfTrigger and memberId are removed from the URL.
 *
 * Renders nothing when the feature is disabled, company is missing, or the modal is closed.
 * The returned `checkoutModalElement` should be rendered in the tree (e.g. from the sidebar).
 */
export function useCheckoutModalContainer({
  companyId,
  fetch,
  navigateInContext,
  t,
}: UseCheckoutModalContainerArgs) {
  const isEnabled = useNavFlag(NavFlags.FS_BILLING_FLOW_NEW_MODAL);
  const searchString =
    typeof window !== "undefined" ? window.location.search : "";

  const params = new URLSearchParams(searchString);
  const hasCfOpen = params.has("cfOpen");
  const cfTriggerParam = params.get("cfTrigger");
  const memberIdParam = params.get("memberId");
  const parsedMemberId =
    memberIdParam != null && memberIdParam !== ""
      ? parseInt(memberIdParam, 10)
      : undefined;
  const checkoutModalMemberIdFromUrl =
    parsedMemberId != null && !Number.isNaN(parsedMemberId)
      ? parsedMemberId
      : undefined;

  const isCheckoutModalOpen = isEnabled && hasCfOpen;

  const basketStartTrigger = parseCfTrigger(cfTriggerParam);

  // Open from a nav action (e.g. "Sell products"); no member pre-selected.
  const openCheckoutModalFromNav = useCallback(() => {
    if (!isEnabled || typeof window === "undefined") return;
    const navParams = new URLSearchParams(window.location.search);
    navParams.set("cfOpen", "");
    navParams.set("cfTrigger", "navbar");
    navParams.delete("memberId");
    const search = navParams.toString();
    const path = window.location.pathname + (search ? `?${search}` : "");
    navigateInContext(path, false);
  }, [isEnabled, navigateInContext]);

  // Close modal and remove cfOpen, cfTrigger & memberId from the URL.
  const handleCheckoutClose = useCallback(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.delete("cfOpen");
      params.delete("cfTrigger");
      params.delete("memberId");
      const search = params.toString();
      const path = window.location.pathname + (search ? `?${search}` : "");
      window.history.replaceState(null, "", path);
    }
  }, []);

  /** On invoice creation: close modal, show toast with "Open" → invoice details. */
  const handleCheckoutSubmit = useCallback(
    (invoiceUuid: string) => {
      const invoiceId = invoiceUuid.slice(0, 8);
      toast({
        status: "default",
        icon: "check",
        description: t("checkoutFlowModal.toasts.invoiceCreated", {
          invoiceId,
        }),
        buttonLabel: t("checkoutFlowModal.toasts.open"),
        onButtonClick: () =>
          navigateInContext(`${LEGACY_URLS.invoice}/${invoiceUuid}`, false),
      });
      handleCheckoutClose();
    },
    [handleCheckoutClose, navigateInContext, t],
  );

  const checkoutStartContext: CheckoutFlowStartContext = {
    basket_start_trigger: basketStartTrigger,
    ...(typeof window !== "undefined" && {
      origin_url: window.location.href,
    }),
  };

  /** Modal tree to render when enabled, company is set, and modal is open; null otherwise. */
  const checkoutModalElement =
    isEnabled && companyId != null && isCheckoutModalOpen ? (
      <CheckoutModalQueryClientProvider>
        <CheckoutFlowModal
          companyId={companyId}
          fetch={fetch}
          isOpen={isCheckoutModalOpen}
          memberId={checkoutModalMemberIdFromUrl}
          onClose={handleCheckoutClose}
          onSubmit={(_data, invoiceUuid) => handleCheckoutSubmit(invoiceUuid)}
          startContext={checkoutStartContext}
          onTrack={(eventName, properties) =>
            analyticsClient.track({ eventType: eventName, ...properties })
          }
        />
      </CheckoutModalQueryClientProvider>
    ) : null;

  return {
    openCheckoutModalFromNav,
    checkoutModalElement,
  };
}
