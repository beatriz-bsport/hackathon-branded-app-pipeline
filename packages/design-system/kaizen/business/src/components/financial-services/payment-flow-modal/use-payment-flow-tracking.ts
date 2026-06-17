import { useCallback } from "react";

import type { PaymentFlowTrackFn } from "./types";

type UsePaymentFlowTrackingOptions = {
  onTrack?: PaymentFlowTrackFn;
  trackingSessionId: string;
};

type UsePaymentFlowTrackingReturn = {
  track: PaymentFlowTrackFn;
};

/**
 * Manages the payment flow session ID and provides a `track` wrapper that
 * auto-injects `basket_session_id` into every event payload.
 *
 * The start event is NOT fired here because it requires async invoice data
 * (total_amount_to_pay). Fire it from usePaymentFlowModalState once the
 * invoice has loaded.
 */
export const usePaymentFlowTracking = ({
  onTrack,
  trackingSessionId,
}: UsePaymentFlowTrackingOptions): UsePaymentFlowTrackingReturn => {
  const track: PaymentFlowTrackFn = useCallback(
    (eventName, properties) => {
      if (!onTrack || !trackingSessionId) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[usePaymentFlowTracking] Skipping track call due to missing dependencies",
            {
              onTrackMissing: !onTrack,
              trackingSessionIdMissing: !trackingSessionId,
              eventName,
            },
          );
        }
        return;
      }

      onTrack(eventName, {
        ...properties,
        basket_session_id: trackingSessionId,
      });
    },
    [onTrack, trackingSessionId],
  );

  return { track };
};
