import { describe, expect, it } from "vitest";

import {
  COMBINE_MODE_OPTIONS,
  CONSENT_OPTIONS,
} from "#src/components/filters/marketing-notification-filter/constants";
import { createDefaultMarketingNotificationFilter } from "#src/components/filters/marketing-notification-filter/default-value";
import { createMarketingNotificationFilterPayload } from "#src/components/filters/marketing-notification-filter/mappers/form-value-to-create-payload";

describe("createMarketingNotificationFilterPayload", () => {
  it("builds the default create payload with is_v2 true", () => {
    const value = createDefaultMarketingNotificationFilter(123);

    const payload = createMarketingNotificationFilterPayload(value);

    expect(payload).toEqual({
      smartlist: 123,
      is_v2: true,
      is_condition_and: true,
      sms_filter_active: false,
      sms_value: false,
      email_filter_active: false,
      email_value: false,
      all_filters_must_be_right: false,
    });
  });

  it("maps active channels and OR combine mode", () => {
    const value = createDefaultMarketingNotificationFilter(123);
    value.smsFilterActive = true;
    value.smsConsent = CONSENT_OPTIONS.accepted;
    value.emailFilterActive = true;
    value.emailConsent = CONSENT_OPTIONS.accepted;
    value.combineMode = COMBINE_MODE_OPTIONS.or;

    const payload = createMarketingNotificationFilterPayload(value);

    expect(payload).toEqual({
      smartlist: 123,
      is_v2: true,
      is_condition_and: false,
      sms_filter_active: true,
      sms_value: true,
      email_filter_active: true,
      email_value: true,
      all_filters_must_be_right: false,
    });
  });
});
