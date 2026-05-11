import type { DateTime } from "@bsport/datetime-manipulation";

import { MIN_SCHEDULE_MINUTES_FROM_NOW } from "./campaign-delivery-mode.constants";

export function isCommunicationScheduledInNightTime(
  hour: number,
  earliestHourToSend: number,
  latestHourToSend: number,
): boolean {
  return hour < earliestHourToSend || hour > latestHourToSend;
}

export function isCommunicationScheduledInPast(
  scheduledDate: DateTime,
): boolean {
  return scheduledDate.diffNow().as("seconds") <= 0;
}

export function isCommunicationScheduledTooSoon(
  scheduledDateTime: DateTime,
  now: DateTime,
  minMinutesFromNow = MIN_SCHEDULE_MINUTES_FROM_NOW,
): boolean {
  const minScheduled = now.plus({ minutes: minMinutesFromNow });
  return scheduledDateTime < minScheduled;
}
