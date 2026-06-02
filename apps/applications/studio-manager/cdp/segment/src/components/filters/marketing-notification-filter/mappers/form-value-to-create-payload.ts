import {
  combineModeOptionToBooleanMap,
  consentOptionToBooleanMap,
} from "../constants";
import type {
  MarketingNotificationFilterCreatePayload,
  MarketingNotificationFilterFormValue,
} from "../types";

/**
 * Builds the `POST /marketing_notifications/` payload from a form value.
 */
export const createMarketingNotificationFilterPayload = (
  value: MarketingNotificationFilterFormValue,
): MarketingNotificationFilterCreatePayload => ({
  smartlist: value.smartlist,
  is_v2: true,
  is_condition_and: combineModeOptionToBooleanMap[value.combineMode],
  sms_filter_active: value.smsFilterActive,
  sms_value: consentOptionToBooleanMap[value.smsConsent],
  email_filter_active: value.emailFilterActive,
  email_value: consentOptionToBooleanMap[value.emailConsent],
  all_filters_must_be_right: false,
});
