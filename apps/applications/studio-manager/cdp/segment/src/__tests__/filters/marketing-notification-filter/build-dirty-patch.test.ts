import type { FieldNamesMarkedBoolean } from "react-hook-form";
import { describe, expect, it } from "vitest";

import {
  COMBINE_MODE_OPTIONS,
  CONSENT_OPTIONS,
} from "#src/components/filters/marketing-notification-filter/constants";
import { createDefaultMarketingNotificationFilter } from "#src/components/filters/marketing-notification-filter/default-value";
import { buildMarketingNotificationFilterDirtyPatch } from "#src/components/filters/marketing-notification-filter/mappers/build-dirty-patch";
import type { MarketingNotificationFilterFormValue } from "#src/components/filters/marketing-notification-filter/types";

type DirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<MarketingNotificationFilterFormValue>>
>;

describe("buildMarketingNotificationFilterDirtyPatch", () => {
  it("returns an empty payload when no field is dirty", () => {
    const value = createDefaultMarketingNotificationFilter(1);
    value.smsFilterActive = true;

    const payload = buildMarketingNotificationFilterDirtyPatch({}, value);

    expect(payload).toEqual({});
  });

  it("emits SMS fields when the SMS toggle is dirty", () => {
    const value = createDefaultMarketingNotificationFilter(1);
    value.smsFilterActive = true;
    value.smsConsent = CONSENT_OPTIONS.accepted;
    const dirtyFields: DirtyFields = { smsFilterActive: true };

    const payload = buildMarketingNotificationFilterDirtyPatch(
      dirtyFields,
      value,
    );

    expect(payload).toEqual({
      sms_filter_active: true,
      sms_value: true,
    });
  });

  it("emits email consent when only the email consent radio is dirty", () => {
    const value = createDefaultMarketingNotificationFilter(1);
    value.emailFilterActive = true;
    value.emailConsent = CONSENT_OPTIONS.rejected;
    const dirtyFields: DirtyFields = { emailConsent: true };

    const payload = buildMarketingNotificationFilterDirtyPatch(
      dirtyFields,
      value,
    );

    expect(payload).toEqual({
      email_value: false,
    });
  });

  it("emits combine mode when the AND/OR select is dirty", () => {
    const value = createDefaultMarketingNotificationFilter(1);
    value.combineMode = COMBINE_MODE_OPTIONS.or;
    const dirtyFields: DirtyFields = { combineMode: true };

    const payload = buildMarketingNotificationFilterDirtyPatch(
      dirtyFields,
      value,
    );

    expect(payload).toEqual({
      is_condition_and: false,
    });
  });

  it("includes is_v2 on legacy rows even when only one field is dirty", () => {
    const value = createDefaultMarketingNotificationFilter(1);
    value.isV2 = false;
    value.smsFilterActive = true;
    value.smsConsent = CONSENT_OPTIONS.accepted;
    const dirtyFields: DirtyFields = { smsFilterActive: true };

    const payload = buildMarketingNotificationFilterDirtyPatch(
      dirtyFields,
      value,
    );

    expect(payload).toEqual({
      sms_filter_active: true,
      sms_value: true,
      is_v2: true,
    });
  });
});
