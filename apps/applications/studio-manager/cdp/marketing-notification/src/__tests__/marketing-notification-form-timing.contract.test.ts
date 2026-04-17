import { beforeEach, describe, expect, it, vi } from "vitest";

import { SUBSCRIPTION_NOTIFICATION_END } from "@bsport/store-cdp-marketing-notification";

import { initializeFormDataFromDraftMarketingNotification } from "#src/components/MarketingNotificationBuilder/Context/form-data-formatting-utils";
import {
  BOOKING_ACTION_MAKES_BOOKING,
  BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Booking/types";
import { PASS_ACTION_DAYS_EXPIRED } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Pass/types";
import { useRefineNotificationFormData } from "#src/hooks/actions/use-refine-notification-form-data";
import { getMarketingSelectableNotificationType } from "#src/utils/marketingNotification";
import {
  APPOINTMENT_PASS_TYPE,
  APPOINTMENT_TYPE,
  BOOKING_TYPE,
  PASS_TYPE,
  SUBSCRIPTION_TYPE,
} from "#src/utils/types";

vi.mock("#src/utils/marketingNotification", () => {
  return {
    getMarketingSelectableNotificationType: vi.fn(() => "subscription"),
  };
});

vi.mock("#src/utils/i18n", () => {
  return {
    useTranslation: () => ({
      t: (key: string, options?: unknown) =>
        `${key}__${JSON.stringify(options ?? {})}`,
    }),
    i18nInstance: {
      t: (key: string, options?: unknown) =>
        `${key}__${JSON.stringify(options ?? {})}`,
    },
  };
});

describe("marketing notification form timing contract", () => {
  const mockedGetMarketingSelectableNotificationType = vi.mocked(
    getMarketingSelectableNotificationType,
  );

  beforeEach(() => {
    mockedGetMarketingSelectableNotificationType.mockReset();
  });

  it("normalizes appointment draft timing to positive value and keeps 'before' temporality", () => {
    mockedGetMarketingSelectableNotificationType.mockReturnValue("appointment");

    const formData = initializeFormDataFromDraftMarketingNotification(
      {
        id: 99,
        kind: SUBSCRIPTION_NOTIFICATION_END,
        event_rules: {
          private_service_id: 14,
          kind: 1,
          notify_booking_nb: 1,
          days: -3,
          hours: 0,
          event_based: true,
          smartlist_exclude: [],
          smartlist_include: [],
        },
      } as never,
      {},
    );

    expect(formData.triggerCondition).toMatchObject({
      type: APPOINTMENT_TYPE,
      timingUnit: "day",
      timingValue: 3,
      timingTemporality: "before",
    });
  });

  it.each([
    {
      notificationType: "location" as const,
      eventRules: { establishment_id: 11 },
    },
    {
      notificationType: "groupActivity" as const,
      eventRules: { meta_activity_id: 22 },
    },
    {
      notificationType: "workshop" as const,
      eventRules: { meta_activity_id: 33 },
    },
    {
      notificationType: "establishment" as const,
      eventRules: { establishment_group_id: 44 },
    },
  ])(
    "normalizes $notificationType draft timing to positive value and keeps 'before' temporality",
    ({ notificationType, eventRules }) => {
      mockedGetMarketingSelectableNotificationType.mockReturnValue(
        notificationType,
      );

      const formData = initializeFormDataFromDraftMarketingNotification(
        {
          id: 99,
          kind: SUBSCRIPTION_NOTIFICATION_END,
          event_rules: {
            ...eventRules,
            kind: 1,
            notify_booking_nb: 1,
            days: -2,
            hours: 0,
            event_based: true,
            smartlist_exclude: [],
            smartlist_include: [],
          },
        } as never,
        {},
      );

      expect(formData.triggerCondition).toMatchObject({
        type: BOOKING_TYPE,
        notificationType,
        timingUnit: "day",
        timingValue: 2,
        timingTemporality: "before",
      });
    },
  );

  it("normalizes pass draft days_left to positive value", () => {
    mockedGetMarketingSelectableNotificationType.mockReturnValue("pass");

    const formData = initializeFormDataFromDraftMarketingNotification(
      {
        id: 99,
        kind: SUBSCRIPTION_NOTIFICATION_END,
        event_rules: {
          payment_pack_ids: [8],
          contains_all_payment_packs: false,
          days_left: -4,
          name: "pass trigger",
          disabled_if_in_contract: false,
          event_based: false,
          smartlist_exclude: [],
          smartlist_include: [],
        },
      } as never,
      {},
    );

    expect(formData.triggerCondition).toMatchObject({
      type: PASS_TYPE,
      daysLeft: 4,
      passEventAction: PASS_ACTION_DAYS_EXPIRED,
    });
  });

  it("normalizes appointment pass draft days_left to positive value", () => {
    mockedGetMarketingSelectableNotificationType.mockReturnValue(
      "appointmentPass",
    );

    const formData = initializeFormDataFromDraftMarketingNotification(
      {
        id: 99,
        kind: SUBSCRIPTION_NOTIFICATION_END,
        event_rules: {
          private_pass_ids: [9],
          contains_all_private_passes: false,
          days_left: -6,
          name: "appointment pass trigger",
          disabled_if_in_contract: false,
          event_based: false,
          smartlist_exclude: [],
          smartlist_include: [],
        },
      } as never,
      {},
    );

    expect(formData.triggerCondition).toMatchObject({
      type: APPOINTMENT_PASS_TYPE,
      daysLeft: 6,
      passEventAction: PASS_ACTION_DAYS_EXPIRED,
    });
  });

  it("normalizes subscription draft timing to positive value and keeps 'before' temporality", () => {
    mockedGetMarketingSelectableNotificationType.mockReturnValue(
      "subscription",
    );

    const formData = initializeFormDataFromDraftMarketingNotification(
      {
        id: 99,
        kind: SUBSCRIPTION_NOTIFICATION_END,
        event_rules: {
          contract_id: 7,
          days: -3,
          hours: 0,
          smartlist_exclude: [],
          smartlist_include: [],
        },
      } as never,
      {},
    );

    expect(formData.triggerCondition).toMatchObject({
      type: SUBSCRIPTION_TYPE,
      contractId: 7,
      timingUnit: "day",
      timingValue: 3,
      timingTemporality: "before",
    });
  });

  it("normalizes subscription draft timing to positive value and keeps 'after' temporality", () => {
    mockedGetMarketingSelectableNotificationType.mockReturnValue(
      "subscription",
    );

    const formData = initializeFormDataFromDraftMarketingNotification(
      {
        id: 99,
        kind: SUBSCRIPTION_NOTIFICATION_END,
        event_rules: {
          contract_id: 7,
          days: 5,
          hours: 0,
          smartlist_exclude: [],
          smartlist_include: [],
        },
      } as never,
      {},
    );

    expect(formData.triggerCondition).toMatchObject({
      type: SUBSCRIPTION_TYPE,
      contractId: 7,
      timingUnit: "day",
      timingValue: 5,
      timingTemporality: "after",
    });
  });

  it("maps subscription 'before' timing to negative event rules even if input timingValue is already negative", () => {
    const { getTriggerEventRules } = useRefineNotificationFormData();

    const eventRules = getTriggerEventRules({
      type: SUBSCRIPTION_TYPE,
      contractId: 7,
      subscriptionEventKind: SUBSCRIPTION_NOTIFICATION_END,
      timingTemporality: "before",
      timingUnit: "day",
      timingValue: -3,
      toggleIncludedSmartlists: false,
      includedSmartlists: [],
      toggleExcludedSmartlists: false,
      excludedSmartlists: [],
    });

    expect(eventRules).toMatchObject({
      contract_id: 7,
      days: -3,
      hours: 0,
    });
  });

  it("maps subscription 'after' timing to positive event rules even if input timingValue is negative", () => {
    const { getTriggerEventRules } = useRefineNotificationFormData();

    const eventRules = getTriggerEventRules({
      type: SUBSCRIPTION_TYPE,
      contractId: 7,
      subscriptionEventKind: SUBSCRIPTION_NOTIFICATION_END,
      timingTemporality: "after",
      timingUnit: "day",
      timingValue: -3,
      toggleIncludedSmartlists: false,
      includedSmartlists: [],
      toggleExcludedSmartlists: false,
      excludedSmartlists: [],
    });

    expect(eventRules).toMatchObject({
      contract_id: 7,
      days: 3,
      hours: 0,
    });
  });

  it.each(["location", "groupActivity", "workshop", "establishment"] as const)(
    "maps %s 'before' timing to negative event rules even if input timingValue is already negative",
    (notificationType) => {
      const { getTriggerEventRules } = useRefineNotificationFormData();

      const eventRules = getTriggerEventRules({
        type: BOOKING_TYPE,
        notificationType,
        bookingItemId: 7,
        bookingEventKind: 1,
        bookingOccurrence: 1,
        bookingOccurrenceType: BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
        bookingActionType: BOOKING_ACTION_MAKES_BOOKING,
        timingTemporality: "before",
        timingUnit: "day",
        timingValue: -3,
        toggleIncludedSmartlists: false,
        includedSmartlists: [],
        toggleExcludedSmartlists: false,
        excludedSmartlists: [],
      });

      expect(eventRules).toMatchObject({
        days: -3,
        hours: 0,
      });
    },
  );

  it("maps appointment 'before' timing to negative event rules even if input timingValue is already negative", () => {
    const { getTriggerEventRules } = useRefineNotificationFormData();

    const eventRules = getTriggerEventRules({
      type: APPOINTMENT_TYPE,
      notificationType: "appointment",
      bookingItemId: 7,
      bookingEventKind: 1,
      bookingOccurrence: 1,
      bookingOccurrenceType: BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
      bookingActionType: BOOKING_ACTION_MAKES_BOOKING,
      timingTemporality: "before",
      timingUnit: "day",
      timingValue: -3,
      toggleIncludedSmartlists: false,
      includedSmartlists: [],
      toggleExcludedSmartlists: false,
      excludedSmartlists: [],
    });

    expect(eventRules).toMatchObject({
      days: -3,
      hours: 0,
    });
  });
});
