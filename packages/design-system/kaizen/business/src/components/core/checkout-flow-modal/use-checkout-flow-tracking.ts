import { useCallback, useEffect, useState } from "react";

import type { CheckoutFlowStartContext, CheckoutFlowTrackFn } from "./types";

type UseCheckoutFlowTrackingOptions = {
  isOpen: boolean;
  memberId?: number;
  startContext?: CheckoutFlowStartContext;
  onTrack: CheckoutFlowTrackFn;
  trackingSessionId: string;
};

type UseCheckoutFlowTrackingReturn = {
  track: CheckoutFlowTrackFn;
};

export const useCheckoutFlowTracking = ({
  isOpen,
  memberId,
  startContext,
  onTrack,
  trackingSessionId,
}: UseCheckoutFlowTrackingOptions): UseCheckoutFlowTrackingReturn => {
  /** Prevents tracking start events more than once while the modal stays open. */
  const [hasTrackedSessionStartEvents, setHasTrackedSessionStartEvents] =
    useState(false);

  useEffect(() => {
    if (!isOpen) {
      setHasTrackedSessionStartEvents(false);
    }
  }, [isOpen]);

  const track: CheckoutFlowTrackFn = useCallback(
    (eventName, properties) => {
      if (!onTrack || !trackingSessionId) {
        if (process.env.NODE_ENV === "development") {
          throw new Error(
            "[useCheckoutFlowTracking] Tracking is not properly configured",
          );
        }
        console.error(
          "[useCheckoutFlowTracking] Skipping track call due to missing dependencies",
          {
            onTrackMissing: !onTrack,
            basketSessionIdMissing: !trackingSessionId,
            eventName,
            properties,
            onTrack,
            trackingSessionId,
          },
        );
        return;
      }

      const payload = {
        ...properties,
        basket_session_id: trackingSessionId,
      };
      onTrack(eventName, payload);
    },
    [onTrack, trackingSessionId],
  );

  useEffect(() => {
    if (
      !isOpen ||
      hasTrackedSessionStartEvents ||
      !trackingSessionId ||
      !onTrack
    )
      return;

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
    } else if (trigger === "session_management_page") {
      track("checkout_flow_bill_offer_button_clicked", specificPayload);
    }

    setHasTrackedSessionStartEvents(true);
  }, [
    isOpen,
    hasTrackedSessionStartEvents,
    trackingSessionId,
    onTrack,
    track,
    startContext,
    memberId,
  ]);

  return { track };
};
