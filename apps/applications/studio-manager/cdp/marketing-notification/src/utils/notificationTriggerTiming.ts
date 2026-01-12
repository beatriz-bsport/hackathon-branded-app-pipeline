import {
  BOOKING_CREATION_NOTIFICATION,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
  MarketingNotification,
  PRIVATE_BOOKING_CREATION_NOTIFICATION,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME,
  SUBSCRIPTION_NOTIFICATION_CREATION,
  SUBSCRIPTION_NOTIFICATION_END,
  SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
  TypedMarketingNotification,
} from "@bsport/store-cdp-marketing-notification";

import { useTranslation } from "#src/utils/i18n";
import { TriggerTimingConfig } from "#src/utils/types";
import { isMarketingNotificationPaymentPackCreditsType } from "#src/utils/typesGuards";

// Type for common timing fields that can appear in event rules
type TimingField = "hours" | "days" | "days_left" | "credits_left";

// Type-safe timing rule configuration
interface TimingRuleConfig {
  key: TimingField;
  unit: TriggerTimingConfig["unit"];
}

/**
 * Extracts timing configuration from marketing notification event rules.
 *
 * This function parses the event rules to determine when a notification should be triggered
 * relative to an event (hours/days before or after). It handles different timing fields
 * like 'hours', 'days', and 'days_left'.
 *
 * @param notification - The marketing notification object containing event rules with timing data
 * @returns Timing configuration object with unit, duration, and direction, or null if no timing found
 */
const extractTimingConfig = (
  notification: MarketingNotification,
): TriggerTimingConfig | null => {
  const { event_rules } = notification;

  // Type-safe rules map with proper typing
  const rulesMap: readonly TimingRuleConfig[] = [
    { key: "hours", unit: "hour" },
    { key: "days", unit: "day" },
    { key: "days_left", unit: "day" },
    { key: "credits_left", unit: "credit" },
  ] as const;

  const isHourTimingZero =
    "hours" in event_rules &&
    typeof event_rules.hours === "number" &&
    event_rules.hours === 0;
  const isDayTimingZero =
    "days" in event_rules &&
    typeof event_rules.days === "number" &&
    event_rules.days === 0;

  if (isDayTimingZero && isHourTimingZero) {
    return {
      unit: "immediate",
      duration: 0,
      beforeOrAfter: "immediate",
    };
  }

  // Helper function to safely extract timing value
  const extractTimingValue = (key: TimingField): TriggerTimingConfig | null => {
    if (key in event_rules) {
      const value = event_rules[key as keyof typeof event_rules];
      if (key === "days" && typeof value === "number" && value === 0) {
        return null;
      }
      if (key === "hours" && typeof value === "number" && value === 0) {
        return null;
      }
      if (typeof value === "number") {
        const config = rulesMap.find((rule) => rule.key === key);
        if (config) {
          return {
            unit: config.unit,
            duration: Math.abs(value),
            beforeOrAfter: value >= 0 ? "after" : "before",
          };
        }
      }
    }
    return null;
  };

  // Check each timing field in priority order
  for (const { key } of rulesMap) {
    const timing = extractTimingValue(key);
    if (timing) {
      return timing;
    }
  }

  return null;
};

/**
 * Hook that generates a localized timing description for booking-related notifications.
 *
 * This hook creates human-readable strings describing when booking notifications
 * should be sent relative to the booking event (e.g., "2 hours before booking",
 * "1 day after booking"). It extracts timing configuration and formats it using
 * the internal translation function from useTranslation hook.
 *
 * @returns Function that takes marketingNotification and returns localized timing description
 */
const useGenerateBookingTriggerTiming = () => {
  const { t } = useTranslation("marketingNotificationList");

  const getBookingTriggerTimingTranslation = (
    marketingNotification:
      | TypedMarketingNotification<typeof PRIVATE_BOOKING_CREATION_NOTIFICATION>
      | TypedMarketingNotification<typeof BOOKING_CREATION_NOTIFICATION>,
  ): string => {
    const timingConfiguration = extractTimingConfig(marketingNotification);

    return String(
      t(
        // @ts-expect-error dynamic key not well managed with our config
        `table.triggerTiming.booking.${timingConfiguration?.beforeOrAfter}.${timingConfiguration?.unit}`,
        {
          count: timingConfiguration?.duration,
        },
      ),
    );
  };

  return {
    getBookingTriggerTimingTranslation,
  };
};

/**
 * Hook that generates a localized timing description for subscription-related notifications.
 *
 * This hook creates human-readable strings describing when subscription notifications
 * should be sent relative to subscription lifecycle events (creation, first billing, end).
 * It determines the subscription event type and combines it with timing information to
 * generate contextually appropriate descriptions.
 * Uses internal translation function from useTranslation hook.
 *
 * @returns Function that takes marketingNotification and returns localized timing description
 */
const useGenerateSubscriptionTriggerTiming = () => {
  const { t } = useTranslation("marketingNotificationList");

  const getSubscriptionTriggerTimingTranslation = (
    marketingNotification:
      | TypedMarketingNotification<typeof SUBSCRIPTION_NOTIFICATION_CREATION>
      | TypedMarketingNotification<typeof SUBSCRIPTION_NOTIFICATION_END>
      | TypedMarketingNotification<
          typeof SUBSCRIPTION_NOTIFICATION_FIRST_BILLING
        >,
  ): string => {
    const subscriptionKindKey =
      marketingNotification.kind === SUBSCRIPTION_NOTIFICATION_END
        ? "end"
        : marketingNotification.kind === SUBSCRIPTION_NOTIFICATION_FIRST_BILLING
          ? "firstBilling"
          : "creation";
    const timingConfiguration = extractTimingConfig(marketingNotification);

    return String(
      t(
        // @ts-expect-error dynamic key not well managed with our config
        `table.triggerTiming.subscription.${subscriptionKindKey}.${timingConfiguration?.beforeOrAfter}.${timingConfiguration?.unit}`,
        { count: timingConfiguration?.duration },
      ),
    );
  };

  return {
    getSubscriptionTriggerTimingTranslation,
  };
};

/**
 * Hook that generates a localized timing description for pass and credit-related notifications.
 *
 * This hook creates human-readable strings for notifications triggered by pass/credit
 * conditions. It handles multiple scenarios:
 * - Credit-based triggers (when X credits remain)
 * - Time-based triggers (when X days left until expiry)
 * - Expired pass triggers (X days after expiry)
 * - Different behaviors for payment packs vs appointment passes
 * - Session booking vs session end timing for credit notifications
 * Uses internal translation function from useTranslation hook.
 *
 * @returns Function that takes marketingNotification and returns localized timing description
 */
const useGeneratePassesTriggerTiming = () => {
  const { t } = useTranslation("marketingNotificationList");

  const getPassesTriggerTimingTranslation = (
    marketingNotification:
      | TypedMarketingNotification<
          typeof CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT
        >
      | TypedMarketingNotification<
          typeof CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME
        >
      | TypedMarketingNotification<
          typeof PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT
        >
      | TypedMarketingNotification<
          typeof PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME
        >,
  ): string => {
    let passTimingKind = "";
    const timingConfiguration = extractTimingConfig(marketingNotification);

    if (
      marketingNotification.kind ===
        CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT ||
      marketingNotification.kind === PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT
    ) {
      passTimingKind = "credits";
    } else if (marketingNotification.event_rules.days_left >= 0) {
      passTimingKind = "validity";
    } else if (marketingNotification.event_rules.days_left < 0) {
      passTimingKind = "expired";
    }

    if (passTimingKind === "expired" || passTimingKind === "validity") {
      return String(
        // @ts-expect-error dynamic key not well managed with our config
        t(`table.triggerTiming.passes.${passTimingKind}.day`, {
          count: timingConfiguration?.duration,
        }),
      );
    } else if (
      isMarketingNotificationPaymentPackCreditsType(marketingNotification)
    ) {
      const sendUponSessionBookingOrEnd =
        marketingNotification.event_rules.kind === 0 ? "booking" : "end";
      return String(
        t(
          // @ts-expect-error dynamic key not well managed with our config
          `table.triggerTiming.passes.${passTimingKind}.${sendUponSessionBookingOrEnd}.hour`,
          { count: timingConfiguration?.duration },
        ),
      );
    } else {
      // it means that this is an appointment pass rule and for this case user does not choose
      // between the booking or end of a session, it is always done at the end of a session
      return t(`table.triggerTiming.passes.credits.appointmentPass`);
    }
  };

  return { getPassesTriggerTimingTranslation };
};

export {
  extractTimingConfig,
  useGenerateBookingTriggerTiming,
  useGenerateSubscriptionTriggerTiming,
  useGeneratePassesTriggerTiming,
};
