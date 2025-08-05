import {
  type NotificationRuleEventCategory,
  notificationRuleEventCategories,
} from "./types";

export function isValidNotificationRuleEventCategory(
  str: string,
): str is NotificationRuleEventCategory {
  return (notificationRuleEventCategories as readonly string[]).includes(str);
}
