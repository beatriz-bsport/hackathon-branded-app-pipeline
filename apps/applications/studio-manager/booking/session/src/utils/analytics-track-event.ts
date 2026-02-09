import { captureException } from "@bsport/sm-backbone";

import type { SafeEventResult } from "#src/types";
import { analyticsClient } from "#src/utils/analytics";

export function analyticsTrackEvent<
  TInput,
  TOutput extends { eventType: string },
>(
  eventBuilder: (params: TInput) => SafeEventResult<TOutput>,
  eventData: TInput,
  muteSentryErrors: boolean = false,
  dropInvalidEvents: boolean = false,
) {
  const { event, errors } = eventBuilder(eventData);
  if (!errors) {
    // No validation errors, track the event as is
    analyticsClient.track(event);
    return;
  }

  if (!dropInvalidEvents) {
    // There were validation errors, but we still want to track the event with the best-effort fallback data
    analyticsClient.track(event);
  }
  if (!muteSentryErrors) {
    // Capture the validation errors in Sentry for debugging, with the eventType as a tag for easier filtering
    captureException(errors.zodError, {
      tags: { eventType: errors.eventType },
    });
  }
}
