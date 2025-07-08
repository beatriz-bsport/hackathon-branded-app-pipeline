import { DateTime } from 'luxon';
import type { CommunicationScheduled } from '#src/libs/communication-v2/types';
import {
  MINUTE_LIMIT_TO_SCHEDULE_COMMUNICATION,
  HOUR_LIMIT_AFTER_SCHEDULED_COMMUNICATION,
} from '#src/libs/communication-v2/constants';

/**
 *
 * @param communicationScheduledTime a timestamp from which to check the editability window
 * @returns whether current time is outside of (communicationScheduledTime - 5 minutes, communicationScheduledTime + 12 hours)
 */
export function checkOutsideLockedWindowFromTime(
  communicationScheduledTime: DateTime,
): boolean {
  return (
    communicationScheduledTime.minus({
      minutes: MINUTE_LIMIT_TO_SCHEDULE_COMMUNICATION,
    }) > DateTime.now() ||
    communicationScheduledTime.plus({
      hours: HOUR_LIMIT_AFTER_SCHEDULED_COMMUNICATION,
    }) < DateTime.now()
  );
}

/**
 * Determines if a scheduled communication can be deleted or edited.
 *
 * A communication is deletable in two time windows:
 * - Before sending: >5 minutes before scheduled time
 * - After sending: >12 hours after scheduled time
 *
 * Locked period: 5 minutes before → 12 hours after scheduled time
 *
 * @param communicationScheduled - The scheduled communication object
 * @returns true if deletable, false if in locked window
 */
export function checkIsScheduledMessageEditable(
  communicationScheduled: CommunicationScheduled,
): boolean {
  const communicationScheduledTime = DateTime.fromISO(
    communicationScheduled.datetime_scheduled,
  );

  return checkOutsideLockedWindowFromTime(communicationScheduledTime);
}
