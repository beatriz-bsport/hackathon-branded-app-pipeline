import type { DateTime } from "@bsport/datetime-manipulation";

import {
  EMAIL_TYPE_INFORMATIONAL,
  EMAIL_TYPE_MARKETING,
  type EmailType,
  MESSAGE_TYPE_EMAIL_TEMPLATE,
  MESSAGE_TYPE_TEXT_ONLY,
  MessageType,
} from "./constants";

export function isEmailTypeValid(emailType: string): emailType is EmailType {
  return (
    emailType === EMAIL_TYPE_MARKETING || emailType === EMAIL_TYPE_INFORMATIONAL
  );
}

export function isMessageTypeValid(
  messageType: string,
): messageType is MessageType {
  return (
    messageType === MESSAGE_TYPE_TEXT_ONLY ||
    messageType === MESSAGE_TYPE_EMAIL_TEMPLATE
  );
}

/**
 * Returns true if the given hour falls outside the company's allowed communication window
 * (i.e. "night time" when communications should not be sent).
 *
 * @param hour - Hour of day (0-23)
 * @param earliestHourToSend - Theme value: first hour when sending is allowed (inclusive)
 * @param latestHourToSend - Theme value: last hour when sending is allowed (inclusive)
 */
export function isCommunicationScheduledInNightTime(
  hour: number,
  earliestHourToSend: number,
  latestHourToSend: number,
): boolean {
  return hour < earliestHourToSend || hour > latestHourToSend;
}

/**
 * Returns true if the scheduled date is before the current date (same timezone).
 * Compares calendar days converted in seconds.
 *
 * @param scheduledDate - The scheduled date (or datetime) to check
 * @param now - The reference "now" datetime in the same timezone
 */
export function isCommunicationScheduledInPast(
  scheduledDate: DateTime,
): boolean {
  return scheduledDate.diffNow().as("seconds") <= 0;
}

/**
 * Returns true if the scheduled datetime is within the given margin from now
 * (e.g. less than 5 minutes from now).
 *
 * @param scheduledDateTime - The scheduled datetime to check
 * @param now - The reference "now" datetime in the same timezone
 * @param minMinutesFromNow - Minimum minutes the scheduled time must be in the future (default: 5)
 */
export function isCommunicationScheduledTooSoon(
  scheduledDateTime: DateTime,
  now: DateTime,
  minMinutesFromNow = 5,
): boolean {
  const minScheduled = now.plus({ minutes: minMinutesFromNow });
  return scheduledDateTime < minScheduled;
}
