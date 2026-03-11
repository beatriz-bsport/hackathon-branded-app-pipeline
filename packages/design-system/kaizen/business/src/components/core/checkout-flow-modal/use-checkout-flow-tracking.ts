import { useCallback, useEffect, useState } from "react";

import type { CheckoutFlowStartContext, CheckoutFlowTrackFn } from "./types";

type UseCheckoutFlowTrackingOptions = {
  isOpen: boolean;
  memberId?: number;
  startContext?: CheckoutFlowStartContext;
  onTrack: CheckoutFlowTrackFn;
  externalBasketSessionId?: string;
};

type UseCheckoutFlowTrackingReturn = {
  basketSessionId: string;
  track: CheckoutFlowTrackFn;
};

const generateSessionId = () => crypto.randomUUID();

export const useCheckoutFlowTracking = ({
  isOpen,
  memberId,
  startContext,
  onTrack,
  externalBasketSessionId,
}: UseCheckoutFlowTrackingOptions): UseCheckoutFlowTrackingReturn => {
  const [basketSessionId, setBasketSessionId] = useState("");
  /** Prevents tracking start events more than once while the modal stays open. */
  const [hasTrackedSessionStartEvents, setHasTrackedSessionStartEvents] =
    useState(false);

  useEffect(() => {
    if (isOpen) {
      setBasketSessionId(externalBasketSessionId ?? generateSessionId());
    } else {
      setBasketSessionId("");
      setHasTrackedSessionStartEvents(false);
    }
  }, [isOpen, externalBasketSessionId]);

  const track: CheckoutFlowTrackFn = useCallback(
    (eventName, properties) => {
      if (!onTrack || !basketSessionId) {
        throw new Error(
          "[useCheckoutFlowTracking] Tracking is not properly configured",
        );
      }
      const payload = {
        ...properties,
        basket_session_id: basketSessionId,
      };
      onTrack(eventName, payload);
    },
    [onTrack, basketSessionId],
  );

  useEffect(() => {
    if (!isOpen || hasTrackedSessionStartEvents || !basketSessionId) return;
    if (!onTrack) {
      throw new Error(
        "[useCheckoutFlowTracking] Tracking is not properly configured",
      );
    }

    const startPayload = {
      basket_start_trigger: startContext?.basket_start_trigger,
      origin_url: startContext?.origin_url,
      ...(memberId != null ? { member_id: memberId } : {}),
    };
    track("checkout_flow_start", startPayload);

    const specificPayload = {
      origin_url: startContext?.origin_url,
      ...(memberId != null ? { member_id: memberId } : {}),
    };
    const trigger = startContext?.basket_start_trigger;
    if (trigger === "navbar") {
      track("checkout_flow_navbar_button_clicked", specificPayload);
    } else if (trigger === "member_profile_page") {
      track(
        "checkout_flow_bill_member_profile_button_clicked",
        specificPayload,
      );
    } else if (trigger === "offer_page") {
      track("checkout_flow_bill_offer_button_clicked", specificPayload);
    }

    setHasTrackedSessionStartEvents(true);
  }, [
    isOpen,
    hasTrackedSessionStartEvents,
    basketSessionId,
    onTrack,
    track,
    startContext,
    memberId,
  ]);

  return { basketSessionId, track };
};
