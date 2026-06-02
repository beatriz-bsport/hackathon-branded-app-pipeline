import type { MarketingNotificationFilter } from "@bsport/api-cdp/smartlist";

import {
  booleanToCombineModeOptionMap,
  booleanToConsentOptionMap,
} from "../constants";
import type { MarketingNotificationFilterFormValue } from "../types";

/**
 * Converts a server-side `MarketingNotificationFilter` payload into the UI form value.
 * Legacy rows (`is_v2: false`) map `all_filters_must_be_right` to the combine Select.
 */
export const mapMarketingNotificationFilterToFormValue = (
  filter: MarketingNotificationFilter,
): MarketingNotificationFilterFormValue => {
  const isConditionAnd = filter.is_v2
    ? filter.is_condition_and
    : filter.all_filters_must_be_right;

  return {
    id: filter.id,
    smartlist: filter.smartlist,
    smsFilterActive: Boolean(filter.sms_filter_active),
    smsConsent: booleanToConsentOptionMap(filter.sms_value),
    emailFilterActive: Boolean(filter.email_filter_active),
    emailConsent: booleanToConsentOptionMap(filter.email_value),
    combineMode: booleanToCombineModeOptionMap(isConditionAnd),
    isV2: filter.is_v2,
  };
};
