import { describe, expect, it } from "vitest";

import {
  COMBINE_MODE_OPTIONS,
  CONSENT_OPTIONS,
} from "#src/components/filters/marketing-notification-filter/constants";
import { createDefaultMarketingNotificationFilter } from "#src/components/filters/marketing-notification-filter/default-value";
import { marketingNotificationFilterSchema } from "#src/components/filters/marketing-notification-filter/schema";

describe("marketingNotificationFilterSchema", () => {
  it("accepts a valid filter with one active channel", () => {
    const value = createDefaultMarketingNotificationFilter(1);
    value.emailFilterActive = true;
    value.emailConsent = CONSENT_OPTIONS.rejected;

    const result = marketingNotificationFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects when both channels are inactive", () => {
    const value = createDefaultMarketingNotificationFilter(1);

    const result = marketingNotificationFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["smsFilterActive"]);
      expect(result.error.issues[0]?.message).toBe("atLeastOneChannelRequired");
    }
  });

  it("accepts both channels active with AND combine mode", () => {
    const value = createDefaultMarketingNotificationFilter(1);
    value.smsFilterActive = true;
    value.smsConsent = CONSENT_OPTIONS.accepted;
    value.emailFilterActive = true;
    value.emailConsent = CONSENT_OPTIONS.accepted;
    value.combineMode = COMBINE_MODE_OPTIONS.and;

    const result = marketingNotificationFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });
});
