import type { SessionEditPayload, SessionWithActivity } from "@bsport/api-book";

import type { SessionEditFormData } from "#src/components/SessionForm/types.js";
import {
  sessionUpdateCreditsUpdatedEvent,
  sessionUpdateDateStartUpdatedEvent,
  sessionUpdateDurationUpdatedEvent,
  sessionUpdateUpdatedEvent,
  sessionUpdateWaitingListMaxSizeUpdatedEvent,
} from "#src/events/session-edition/events.js";

import { analyticsClient } from "./analytics";

// This type replicates the structure of dirtyFields from react-hook-form.
type DirtyFields<T> = Partial<{
  [K in keyof T]: T[K] extends unknown[]
    ? boolean[]
    : T[K] extends object
      ? DirtyFields<T[K]>
      : boolean;
}>;

export type TrackSessionEditionParams = {
  dirtyFields: DirtyFields<SessionEditFormData>;
  oldValues: SessionWithActivity;
  newValues: SessionEditPayload;
};

/**
 * Tracks the edition of a session by comparing the old and new values of the session form and sending analytics events for each changed field.
 * Only tracks a predefined set of fields (waiting list max size, credits, start date and time, duration) to avoid spamming analytics with too many events.
 */
export const trackSessionEdition = ({
  dirtyFields,
  oldValues,
  newValues,
}: TrackSessionEditionParams) => {
  if (dirtyFields.waiting_list_max_size) {
    analyticsClient.trackEvent(
      sessionUpdateWaitingListMaxSizeUpdatedEvent({
        session_id: oldValues.id,
        old_waiting_list_max_size: oldValues.waiting_list_max_size,
        new_waiting_list_max_size: newValues.waiting_list_max_size,
        delta:
          newValues.waiting_list_max_size - oldValues.waiting_list_max_size,
      }),
    );
  }
  if (
    dirtyFields.credits &&
    newValues.credit_price_override != null &&
    oldValues.credit_price_override != null
  ) {
    analyticsClient.trackEvent(
      sessionUpdateCreditsUpdatedEvent({
        session_id: oldValues.id,
        old_credits: oldValues.credit_price_override,
        new_credits: newValues.credit_price_override,
        delta:
          newValues.credit_price_override - oldValues.credit_price_override,
      }),
    );
  }
  if (dirtyFields.startDateTime) {
    analyticsClient.trackEvent(
      sessionUpdateDateStartUpdatedEvent({
        session_id: oldValues.id,
        old_date_start: oldValues.date_start,
        new_date_start: newValues.date_start,
      }),
    );
  }
  if (
    dirtyFields.duration_minute &&
    newValues.duration_minute != null &&
    oldValues.duration_minute != null
  ) {
    analyticsClient.trackEvent(
      sessionUpdateDurationUpdatedEvent({
        session_id: oldValues.id,
        old_duration: oldValues.duration_minute,
        new_duration: newValues.duration_minute,
        delta: newValues.duration_minute - oldValues.duration_minute,
      }),
    );
  }
  analyticsClient.trackEvent(
    sessionUpdateUpdatedEvent({
      session_id: oldValues.id,
      session_name: oldValues.name,
      session_visibility: oldValues.manager_only ? "unlisted" : "listed",
      session_available: oldValues.available,
      session_date: oldValues.date_start,
      updated_fields: Object.keys(dirtyFields),
    }),
  );
};
