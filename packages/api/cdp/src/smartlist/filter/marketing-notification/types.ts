import type { SmartlistFilterPayload } from "../../shared/types";

/**
 * Smartlist marketing notification consent filter (filter identifier 103).
 * Endpoint family: `/customer-data-platform/v1/smartlist/marketing_notifications/`
 */
export type MarketingNotificationFilter = SmartlistFilterPayload & {
  company: number;
  sms_filter_active: boolean | null;
  sms_value: boolean;
  email_filter_active: boolean | null;
  email_value: boolean;
  is_condition_and: boolean;
  is_v2: boolean;
  all_filters_must_be_right: boolean;
};

export type CreateMarketingNotificationFilterPayload = Omit<
  MarketingNotificationFilter,
  "id" | "company" | "filter_identifier"
>;

export type UpdateMarketingNotificationFilterPayload = Partial<
  Omit<
    MarketingNotificationFilter,
    "id" | "company" | "smartlist" | "filter_identifier"
  >
>;
