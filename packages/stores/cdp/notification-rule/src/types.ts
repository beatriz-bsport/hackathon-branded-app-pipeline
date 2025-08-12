export type CommunicationVariable = {
  [tag_name: string]: Array<string>;
};

export type GenericCommunicationVariable = {
  [tag_name: string]: string;
};

export type NotificationRuleEvent = {
  notification_event: number;
  is_editable: boolean;
  is_instance_specific: boolean;
  notification_group: string;
  required_tags: string[];
};

export type NotificationRuleDetail = {
  id: number;
  company: number | null;
  notification_event: number;
  email_design: number;
  franchisor: number | null;
  companies: number[];
  title: string;
  send_franchisor_carbon_copy: boolean;
  is_active: boolean;
  is_notification_push_active: boolean;
  push_notification_title: string | null;
  push_notification_content: string | null;
};

export type NotificationRuleEventSetting = {
  disabled: boolean;
  send_company: boolean;
  disabled_checkboxes?: boolean;
};

export type NotificationRuleSettings = {
  id: number | null;
  company: number | null;
  settings: Record<number, NotificationRuleEventSetting>;
};

export type NotificationRuleSettingsResult = Array<{
  company: number | null;
  id: number | null;
  settings: Record<number, NotificationRuleEventSetting>;
}>;

/**
 * Valid notification rule event category identifiers.
 * These correspond to the notification_group values from the API and translation keys.
 *
 * @example
 * ```tsx
 * // Use with the formatting hook
 * const categories: NotificationRuleEventCategory[] = ["member", "booking", "payment_pack"];
 * const { formatNotificationRuleEventListItems } = useFormatNotificationEventList({
 *   notificationRuleEventMapByGroup
 * });
 * const listItems = formatNotificationRuleEventListItems(categories);
 * ```
 */

export const notificationRuleEventCategories = [
  "member",
  "booking",
  "private_booking",
  "recurrent_private_booking",
  "payment_pack",
  "giftcard",
  "offer",
  "replacement_request",
  "waiting_list",
  "subscription",
  "invoice",
  "referral",
] as const;

export type NotificationRuleEventCategory =
  (typeof notificationRuleEventCategories)[number];
