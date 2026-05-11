import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";

const MINUTES_THRESHOLD_BEFORE_SEND = 5;

export function isScheduledCommunicationLocked(
  datetimeScheduledIso: string,
  minutesThreshold = MINUTES_THRESHOLD_BEFORE_SEND,
): boolean {
  const scheduledDateTime = fromIsoString(datetimeScheduledIso);
  const now = getLocalNow({});
  const diffMinutes = scheduledDateTime.diff(now, "minutes").as("minutes");

  return diffMinutes > 0 && diffMinutes < minutesThreshold;
}
