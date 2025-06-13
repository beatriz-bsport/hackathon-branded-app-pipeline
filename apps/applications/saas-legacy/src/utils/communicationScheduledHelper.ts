import { DateTime } from 'luxon';
import type { CommunicationScheduled } from '#src/libs/communication-v2/types';
import {
  MINUTE_LIMIT_TO_SCHEDULE_COMMUNICATION,
  HOUR_LIMIT_AFTER_SCHEDULED_COMMUNICATION,
} from '#src/libs/communication-v2/constants';

/**
 * Determines if a scheduled communication can be edited.
 *
 * A communication is editable in one time window:
 *
 * - Before sending: >5 minutes before scheduled time
 *
 * Locked period: from 5 minutes before scheduled time onwards
 *
 @param communicationScheduled - The scheduled communication object
 @returns true if editable, false if in locked window
 */
export function checkIsMessageSchedulable(
  communicationScheduled: CommunicationScheduled,
): boolean {
  const communicationScheduledTime = DateTime.fromISO(
    communicationScheduled.datetime_scheduled,
  );

  return (
    communicationScheduledTime.minus({
      minutes: MINUTE_LIMIT_TO_SCHEDULE_COMMUNICATION,
    }) > DateTime.now()
  );
}

/**
 * Determines if a scheduled communication can be deleted.
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
export function checkIsMessageDeletable(
  communicationScheduled: CommunicationScheduled,
): boolean {
  const communicationScheduledTime = DateTime.fromISO(
    communicationScheduled.datetime_scheduled,
  );

  return (
    communicationScheduledTime.minus({
      minutes: MINUTE_LIMIT_TO_SCHEDULE_COMMUNICATION,
    }) > DateTime.now() ||
    communicationScheduledTime.plus({
      hours: HOUR_LIMIT_AFTER_SCHEDULED_COMMUNICATION,
    }) < DateTime.now()
  );
}
