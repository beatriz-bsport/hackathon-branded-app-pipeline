import { describe, expect, it } from "vitest";

import { MARKETING_NOTIFICATION_FILTER_IDENTIFIER } from "@bsport/api-cdp/smartlist";

import {
  COMBINE_MODE_OPTIONS,
  CONSENT_OPTIONS,
} from "#src/components/filters/marketing-notification-filter/constants";
import { mapMarketingNotificationFilterToFormValue } from "#src/components/filters/marketing-notification-filter/mappers/api-to-form-value";

describe("mapMarketingNotificationFilterToFormValue", () => {
  it("maps v2 filters using is_condition_and", () => {
    const formValue = mapMarketingNotificationFilterToFormValue({
      id: 901,
      company: 7,
      smartlist: 123,
      filter_identifier: Number(MARKETING_NOTIFICATION_FILTER_IDENTIFIER),
      sms_filter_active: true,
      sms_value: true,
      email_filter_active: true,
      email_value: false,
      is_condition_and: false,
      is_v2: true,
      all_filters_must_be_right: false,
    });

    expect(formValue).toEqual({
      id: 901,
      smartlist: 123,
      smsFilterActive: true,
      smsConsent: CONSENT_OPTIONS.accepted,
      emailFilterActive: true,
      emailConsent: CONSENT_OPTIONS.rejected,
      combineMode: COMBINE_MODE_OPTIONS.or,
      isV2: true,
    });
  });

  it("maps legacy filters using all_filters_must_be_right for combine mode", () => {
    const formValue = mapMarketingNotificationFilterToFormValue({
      id: 902,
      company: 7,
      smartlist: 123,
      filter_identifier: Number(MARKETING_NOTIFICATION_FILTER_IDENTIFIER),
      sms_filter_active: true,
      sms_value: false,
      email_filter_active: false,
      email_value: false,
      is_condition_and: false,
      is_v2: false,
      all_filters_must_be_right: true,
    });

    expect(formValue).toEqual({
      id: 902,
      smartlist: 123,
      smsFilterActive: true,
      smsConsent: CONSENT_OPTIONS.rejected,
      emailFilterActive: false,
      emailConsent: CONSENT_OPTIONS.rejected,
      combineMode: COMBINE_MODE_OPTIONS.and,
      isV2: false,
    });
  });
});
