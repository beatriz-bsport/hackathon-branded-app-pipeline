import { NOTIFICATION_TYPE_EMAIL, NOTIFICATION_TYPE_PUSH } from "./constants";
import type { NotificationSegments } from "./types";

export function isNotificationSegment(
  value: string,
): value is NotificationSegments {
  return value === NOTIFICATION_TYPE_EMAIL || value === NOTIFICATION_TYPE_PUSH;
}
