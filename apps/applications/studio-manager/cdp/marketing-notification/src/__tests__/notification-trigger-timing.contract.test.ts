import { describe, expect, it, vi } from "vitest";

import {
  BOOKING_CREATION_NOTIFICATION,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
  PRIVATE_BOOKING_CREATION_NOTIFICATION,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME,
  SUBSCRIPTION_NOTIFICATION_CREATION,
  SUBSCRIPTION_NOTIFICATION_END,
  SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
} from "@bsport/store-cdp-marketing-notification";

import {
  extractTimingConfig,
  useGenerateBookingTriggerTiming,
  useGeneratePassesTriggerTiming,
  useGenerateSubscriptionTriggerTiming,
} from "#src/utils/notificationTriggerTiming";

vi.mock("#src/utils/i18n", () => {
  return {
    useTranslation: () => ({
      t: (key: string, options?: unknown) =>
        `${key}__${JSON.stringify(options ?? {})}`,
    }),
  };
});

const MOCK_BASE_MARKETING_NOTIFICATION = {
  id: 1,
  company: 1,
  is_event_based: true,
  email_design: 1,
  push_notification_title: "test",
  push_notification_content: "test",
  active: true,
};

/**
 * These tests encode the intended contract described from API behavior:
 * - days/hours are the timing source
 * - a non-zero value wins over 0/null
 * - 0 + null means "0 is the value to use" (no delay)
 * - both 0/null => immediate
 *
 * Some subscription expectations are intentionally "correct-by-contract" and may fail
 * against the current helper implementation. We'll fix the helpers afterwards.
 */
describe("notificationTriggerTiming contract (days/hours)", () => {
  it("uses days when days is non-zero (even if hours is 0)", () => {
    const timing = extractTimingConfig({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: SUBSCRIPTION_NOTIFICATION_END,
      event_rules: {
        days: 3,
        hours: 0,
        contract_id: 1,
        event_based: true,
        smartlist_exclude: [],
        smartlist_include: [],
      },
    });
    // Intended contract: days=3 should win over hours=0
    expect(timing).toEqual({
      unit: "day",
      duration: 3,
      beforeOrAfter: "after",
    });
  });

  it("uses hours when days is 0 and hours is non-zero", () => {
    const timing = extractTimingConfig({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: SUBSCRIPTION_NOTIFICATION_END,
      event_rules: {
        days: 0,
        hours: -2,
        contract_id: 1,
        event_based: true,
        smartlist_exclude: [],
        smartlist_include: [],
      },
    });

    expect(timing).toEqual({
      unit: "hour",
      duration: 2,
      beforeOrAfter: "before",
    });
  });

  it("treats days:0 + hours:null as '0 day' (no delay)", () => {
    const timing = extractTimingConfig({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
      event_rules: {
        days: 0,
        hours: null,
        contract_id: 1,
        event_based: true,
        smartlist_exclude: [],
        smartlist_include: [],
      },
    });

    // Intended contract: one side is 0, the other is missing => 0 is meaningful.
    // For UI this should behave like immediate (no delay).
    expect(timing).toEqual({
      unit: "immediate",
      duration: 0,
      beforeOrAfter: "immediate",
    });
  });

  it("treats hours:0 + days:null as immediate", () => {
    const timing = extractTimingConfig({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
      event_rules: {
        days: null,
        hours: 0,
        contract_id: 1,
        event_based: true,
        smartlist_exclude: [],
        smartlist_include: [],
      },
    });

    expect(timing).toEqual({
      unit: "immediate",
      duration: 0,
      beforeOrAfter: "immediate",
    });
  });

  it("treats days:0 + hours:0 as immediate", () => {
    const timing = extractTimingConfig({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: SUBSCRIPTION_NOTIFICATION_END,
      event_rules: {
        days: 0,
        hours: 0,
        contract_id: 1,
        event_based: true,
        smartlist_exclude: [],
        smartlist_include: [],
      },
    });

    expect(timing).toEqual({
      unit: "immediate",
      duration: 0,
      beforeOrAfter: "immediate",
    });
  });
});

describe("useGenerateSubscriptionTriggerTiming (intended translation keys)", () => {
  it("renders subscription creation immediate when both days and hours are 0", () => {
    const { getSubscriptionTriggerTimingTranslation } =
      useGenerateSubscriptionTriggerTiming();

    const text = getSubscriptionTriggerTimingTranslation({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: SUBSCRIPTION_NOTIFICATION_CREATION,
      event_rules: {
        days: 0,
        hours: 0,
        contract_id: 1,
        event_based: true,
        smartlist_exclude: [],
        smartlist_include: [],
      },
    });

    expect(text).toBe(
      "table.triggerTiming.subscription.creation.immediate.immediate__" +
        JSON.stringify({ count: 0 }),
    );
  });

  it("renders subscription end timing using day when days is non-zero (even if hours is 0)", () => {
    const { getSubscriptionTriggerTimingTranslation } =
      useGenerateSubscriptionTriggerTiming();

    const text = getSubscriptionTriggerTimingTranslation({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: SUBSCRIPTION_NOTIFICATION_END,
      event_rules: {
        days: 3,
        hours: 0,
        contract_id: 1,
        event_based: true,
        smartlist_exclude: [],
        smartlist_include: [],
      },
    });

    // Intended contract: should NOT be immediate; should use day+after.
    expect(text).toBe(
      "table.triggerTiming.subscription.end.after.day__" +
        JSON.stringify({ count: 3 }),
    );
  });

  it("renders subscription first billing timing using hour when hours is non-zero", () => {
    const { getSubscriptionTriggerTimingTranslation } =
      useGenerateSubscriptionTriggerTiming();

    const text = getSubscriptionTriggerTimingTranslation({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
      event_rules: {
        days: 0,
        hours: -2,
        contract_id: 1,
        event_based: true,
        smartlist_exclude: [],
        smartlist_include: [],
      },
    });

    expect(text).toBe(
      "table.triggerTiming.subscription.firstBilling.before.hour__" +
        JSON.stringify({ count: 2 }),
    );
  });
});

describe("useGenerateBookingTriggerTiming (intended translation keys)", () => {
  it("renders booking immediate when days and hours are 0", () => {
    const { getBookingTriggerTimingTranslation } =
      useGenerateBookingTriggerTiming();

    const text = getBookingTriggerTimingTranslation({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: BOOKING_CREATION_NOTIFICATION,
      event_rules: {
        days: 0,
        hours: 0,
        kind: 3,
        event_based: true,
        smartlist_exclude: [],
        smartlist_include: [],
        notify_booking_nb: 1,
        establishment_group_id: null,
        establishment_id: null,
        meta_activity_id: 30,
      },
    });

    expect(text).toBe(
      "table.triggerTiming.booking.immediate.immediate__" +
        JSON.stringify({ count: 0 }),
    );
  });

  it("renders private booking with before hour timing", () => {
    const { getBookingTriggerTimingTranslation } =
      useGenerateBookingTriggerTiming();

    const text = getBookingTriggerTimingTranslation({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: PRIVATE_BOOKING_CREATION_NOTIFICATION,
      event_rules: {
        days: 0,
        hours: -2,
        kind: 1,
        notify_booking_nb: 2,
        private_service_id: 2939,
        event_based: true,
        smartlist_exclude: [],
        smartlist_include: [],
      },
    });

    expect(text).toBe(
      "table.triggerTiming.booking.before.hour__" +
        JSON.stringify({ count: 2 }),
    );
  });
});

describe("useGeneratePassesTriggerTiming (intended translation keys)", () => {
  it("renders payment pack time as validity when days_left is positive", () => {
    const { getPassesTriggerTimingTranslation } =
      useGeneratePassesTriggerTiming();

    const text = getPassesTriggerTimingTranslation({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
      event_rules: {
        days_left: 3,
        event_based: false,
        payment_pack_ids: [1],
        contains_all_payment_packs: false,
        disabled_if_in_contract: false,
        smartlist_exclude: [],
        smartlist_include: [],
        name: "time trigger",
      },
    });

    expect(text).toBe(
      "table.triggerTiming.passes.validity.day__" +
        JSON.stringify({ count: 3 }),
    );
  });

  it("renders private pass time as expired when days_left is negative", () => {
    const { getPassesTriggerTimingTranslation } =
      useGeneratePassesTriggerTiming();

    const text = getPassesTriggerTimingTranslation({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME,
      event_rules: {
        days_left: -15,
        event_based: false,
        private_pass_ids: [149],
        contains_all_private_passes: false,
        disabled_if_in_contract: false,
        smartlist_exclude: [],
        smartlist_include: [],
        name: "expired trigger",
      },
    });

    expect(text).toBe(
      "table.triggerTiming.passes.expired.day__" +
        JSON.stringify({ count: 15 }),
    );
  });

  it("renders payment pack credits on booking when kind is 0", () => {
    const { getPassesTriggerTimingTranslation } =
      useGeneratePassesTriggerTiming();

    const text = getPassesTriggerTimingTranslation({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
      event_rules: {
        credits_left: 2,
        hours: 2,
        kind: 0,
        event_based: true,
        payment_pack_ids: [1],
        contains_all_payment_packs: false,
        disabled_if_in_contract: false,
        smartlist_exclude: [],
        smartlist_include: [],
        name: "credits booking trigger",
      },
    });

    expect(text).toBe(
      "table.triggerTiming.passes.credits.booking.hour__" +
        JSON.stringify({ count: 2 }),
    );
  });

  it("renders payment pack credits on session end when kind is not 0", () => {
    const { getPassesTriggerTimingTranslation } =
      useGeneratePassesTriggerTiming();

    const text = getPassesTriggerTimingTranslation({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
      event_rules: {
        credits_left: 2,
        hours: 6,
        kind: 1,
        event_based: true,
        payment_pack_ids: [1],
        contains_all_payment_packs: false,
        disabled_if_in_contract: false,
        smartlist_exclude: [],
        smartlist_include: [],
        name: "credits end trigger",
      },
    });

    expect(text).toBe(
      "table.triggerTiming.passes.credits.end.hour__" +
        JSON.stringify({ count: 6 }),
    );
  });

  it("renders private pass credits with appointment pass translation", () => {
    const { getPassesTriggerTimingTranslation } =
      useGeneratePassesTriggerTiming();

    const text = getPassesTriggerTimingTranslation({
      ...MOCK_BASE_MARKETING_NOTIFICATION,
      kind: PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
      event_rules: {
        credits_left: 2,
        hours: 0,
        kind: 1,
        event_based: true,
        private_pass_ids: [149],
        contains_all_private_passes: false,
        disabled_if_in_contract: false,
        smartlist_exclude: [],
        smartlist_include: [],
        name: "private credits trigger",
      },
    });

    expect(text).toBe("table.triggerTiming.passes.credits.appointmentPass__{}");
  });
});
