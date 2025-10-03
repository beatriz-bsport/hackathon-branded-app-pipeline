import type { Appointment } from "@bsport/store-booking-appointment";
import type { MetaActivity } from "@bsport/store-booking-group-activity";
import type { AppointmentPass } from "@bsport/store-buyables-appointment-pass";
import type { Pass } from "@bsport/store-buyables-pass";
import type { Subscription } from "@bsport/store-buyables-subscription";
import type {
  BookingCreationEventRules,
  MarketingNotification,
} from "@bsport/store-cdp-marketing-notification";
import type { Establishment } from "@bsport/store-core-data-establishment";

import { NOTIFICATION_ADVANCED_TYPE } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import {
  hasEstablishmentId,
  hasMetaActivityId,
  hasPrivateServiceId,
} from "#src/utils/typeGuards";
import {
  CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
  type NotificationType,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME,
  SUBSCRIPTION_NOTIFICATION_CREATION,
  SUBSCRIPTION_NOTIFICATION_END,
  SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
  TRIGGER_KINDS,
  type TriggerTimingConfig,
} from "#src/utils/types";

/**
 * Extracts the primary entity ID from a marketing notification's event rules.
 *
 * This function examines the event_rules of a notification and returns the most relevant
 * entity ID based on the notification type (meta_activity_id, establishment_id, private_service_id, etc.).
 *
 * @param notification - The marketing notification object containing event rules
 * @returns The extracted entity ID, or null if no relevant ID is found
 */
const extractEntityId = (
  notification: MarketingNotification,
): number | null => {
  const { event_rules } = notification;

  if (hasMetaActivityId(event_rules)) {
    return event_rules.meta_activity_id;
  }

  if (hasEstablishmentId(event_rules)) {
    return event_rules.establishment_id;
  }

  if (
    "establishment_group_id" in event_rules &&
    event_rules.establishment_group_id
  ) {
    return event_rules.establishment_group_id;
  }

  if (hasPrivateServiceId(event_rules)) {
    return event_rules.private_service_id;
  }

  if (
    "payment_pack_ids" in event_rules &&
    Array.isArray(event_rules.payment_pack_ids) &&
    event_rules.payment_pack_ids.length > 0
  ) {
    return event_rules.payment_pack_ids[0];
  }

  if (
    "private_pass_ids" in event_rules &&
    Array.isArray(event_rules.private_pass_ids) &&
    event_rules.private_pass_ids.length > 0
  ) {
    return event_rules.private_pass_ids[0];
  }

  if ("contract_id" in event_rules && event_rules.contract_id) {
    return event_rules.contract_id;
  }

  return null;
};

/**
 * Finds the display name of an entity based on its type and ID.
 *
 * This function looks up entity names from various collections (activities, establishments, etc.)
 * based on the notification trigger type and entity ID. It provides fallback names when entities are not found.
 *
 * @param triggerType - The type of notification trigger (e.g., "workshop", "location", "subscription")
 * @param entityId - The ID of the entity to look up, or null
 * @param entities - Object containing collections of different entity types indexed by ID
 * @returns The display name of the entity, fallback name, or empty string if not found
 */
const findEntityName = (
  triggerType: NotificationType,
  entityId: number | null,
  entities: {
    groupActivitiesById: Record<number, MetaActivity>;
    establishmentsById: Record<number, Establishment>;
    appointmentsById: Record<number, Appointment>;
    appointmentPassesById: Record<number, AppointmentPass>;
    subscriptionsById: Record<number, Subscription>;
    passesById: Record<number, Pass>;
  },
): string => {
  if (!entityId) return "";

  const {
    groupActivitiesById,
    establishmentsById,
    appointmentsById,
    appointmentPassesById,
    subscriptionsById,
    passesById,
  } = entities;

  switch (triggerType) {
    case NOTIFICATION_ADVANCED_TYPE.workshop:
    case NOTIFICATION_ADVANCED_TYPE.groupActivity: {
      const activity = groupActivitiesById[entityId];
      return activity?.name ?? NOTIFICATION_ADVANCED_TYPE.groupActivity;
    }

    case NOTIFICATION_ADVANCED_TYPE.location: {
      const location = establishmentsById[entityId];
      return location?.title ?? NOTIFICATION_ADVANCED_TYPE.location;
    }

    case NOTIFICATION_ADVANCED_TYPE.privateService: {
      const appointment = appointmentsById[entityId];
      return appointment?.name ?? NOTIFICATION_ADVANCED_TYPE.privateService;
    }

    case NOTIFICATION_ADVANCED_TYPE.paymentPack: {
      const pass = passesById[entityId];
      return pass?.name ?? NOTIFICATION_ADVANCED_TYPE.paymentPack;
    }

    case NOTIFICATION_ADVANCED_TYPE.privatePass: {
      const pass = appointmentPassesById[entityId];
      return pass?.name ?? NOTIFICATION_ADVANCED_TYPE.privatePass;
    }

    case NOTIFICATION_ADVANCED_TYPE.subscription: {
      const subscription = subscriptionsById[entityId];
      return subscription?.name ?? NOTIFICATION_ADVANCED_TYPE.subscription;
    }

    default:
      return "";
  }
};

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

  if (
    "hours" in event_rules &&
    typeof event_rules.hours === "number" &&
    event_rules.hours !== 0
  ) {
    const hours = event_rules.hours;
    return {
      unit: "hours",
      duration: Math.abs(hours),
      beforeOrAfter: hours >= 0 ? "after" : "before",
    };
  }

  if (
    "days" in event_rules &&
    typeof event_rules.days === "number" &&
    event_rules.days !== 0
  ) {
    const days = event_rules.days;
    return {
      unit: "days",
      duration: Math.abs(days),
      beforeOrAfter: days >= 0 ? "after" : "before",
    };
  }

  if (
    "days_left" in event_rules &&
    typeof event_rules.days_left === "number" &&
    event_rules.days_left !== 0
  ) {
    const days = event_rules.days_left;
    return {
      unit: "days",
      duration: Math.abs(days),
      beforeOrAfter: days >= 0 ? "after" : "before",
    };
  }

  return null;
};

/**
 * Hook that generates a human-readable trigger type description for booking-related notifications.
 *
 * This hook creates localized strings describing when booking notifications should be sent
 * based on booking events (attended, cancelled, etc.) and occurrence patterns (any booking vs after X bookings).
 * Uses internal translation function from useTranslation hook.
 *
 * @returns Function that takes eventRules and entityName and returns localized trigger description
 */
const useGenerateBookingTriggerType = () => {
  const { t } = useTranslation("marketingNotificationList");

  const getBookingTriggerTypeTranslation = (
    eventRules: BookingCreationEventRules,
    entityName: string,
  ): string => {
    const { kind, notify_booking_nb = 0 } = eventRules;
    const occurrenceType = notify_booking_nb > 0 ? "afterX" : "any";

    // Here we can create a mapping of trigger kinds to translation keys and use it to get the right key
    // This kind is different from the notification kind and is specific to booking events
    const triggerTypeMap: Record<number, string> = {
      [TRIGGER_KINDS.BOOKING_ATTENDED]: String(
        // @ts-expect-error translation key not being discovered by typescript
        t(`table.triggerType.booking.attended.present.${occurrenceType}`, {
          count: notify_booking_nb,
          entityName,
        }),
      ),
      [TRIGGER_KINDS.BOOKING_APPOINTMENT_ATTENDED]: String(
        // @ts-expect-error translation key not being discovered by typescript
        t(`table.triggerType.booking.attended.present.${occurrenceType}`, {
          count: notify_booking_nb,
          entityName,
        }),
      ),
      [TRIGGER_KINDS.BOOKING_NOT_ATTENDED]: String(
        // @ts-expect-error translation key not being discovered by typescript
        t(`table.triggerType.booking.attended.absent.${occurrenceType}`, {
          count: notify_booking_nb,
          entityName,
        }),
      ),
      [TRIGGER_KINDS.BOOKING_CANCELLED_ON_TIME]: String(
        // @ts-expect-error translation key not being discovered by typescript
        t(`table.triggerType.booking.cancelled.onTime.${occurrenceType}`, {
          count: notify_booking_nb,
          entityName,
        }),
      ),
      [TRIGGER_KINDS.BOOKING_APPOINTMENT_CANCELLED_ON_TIME]: String(
        // @ts-expect-error translation key not being discovered by typescript
        t(`table.triggerType.booking.cancelled.onTime.${occurrenceType}`, {
          count: notify_booking_nb,
          entityName,
        }),
      ),
      [TRIGGER_KINDS.BOOKING_CANCELLED_TOO_LATE]: String(
        // @ts-expect-error translation key not being discovered by typescript
        t(`table.triggerType.booking.cancelled.tooLate.${occurrenceType}`, {
          count: notify_booking_nb,
          entityName,
        }),
      ),
      [TRIGGER_KINDS.BOOKING_APPOINTMENT_CANCELLED_TOO_LATE]: String(
        // @ts-expect-error translation key not being discovered by typescript
        t(`table.triggerType.booking.cancelled.tooLate.${occurrenceType}`, {
          count: notify_booking_nb,
          entityName,
        }),
      ),
    };

    const translationKey = triggerTypeMap[kind];
    if (!translationKey) {
      return "";
    }
    return translationKey;
  };

  return {
    getBookingTriggerTypeTranslation,
  };
};

/**
 * Hook that generates a human-readable trigger type description for subscription-related notifications.
 *
 * This hook creates localized strings describing when subscription notifications should be sent
 * based on subscription lifecycle events (creation, first billing, end).
 * Uses internal translation function from useTranslation hook.
 *
 * @returns Function that takes notification and entityName and returns localized trigger description
 */
const useGenerateSubscriptionTriggerType = () => {
  const { t } = useTranslation("marketingNotificationList");

  const getSubscriptionTriggerTypeTranslation = (
    notification: MarketingNotification,
    entityName: string,
  ): string => {
    const { kind } = notification;

    switch (kind) {
      case SUBSCRIPTION_NOTIFICATION_CREATION:
      case SUBSCRIPTION_NOTIFICATION_FIRST_BILLING:
        return t("table.triggerType.subscription.started", { entityName });

      case SUBSCRIPTION_NOTIFICATION_END:
        return t("table.triggerType.subscription.ended", { entityName });

      default:
        return "";
    }
  };

  return {
    getSubscriptionTriggerTypeTranslation,
  };
};

/**
 * Hook that generates a human-readable trigger type description for pass/credit-based notifications.
 *
 * This hook creates localized strings for notifications triggered by pass or credit conditions,
 * handling both time-based (days left) and credit-based triggers. It differentiates between
 * notifications for all passes vs specific pass types.
 * Uses internal translation function from useTranslation hook.
 *
 * @returns Function that takes notification and entityName and returns localized trigger description
 */
const useGeneratePassesTriggerType = () => {
  const { t } = useTranslation("marketingNotificationList");

  const getPassesTriggerTypeTranslation = (
    notification: MarketingNotification,
    entityName: string,
  ): string => {
    const { kind, event_rules } = notification;

    switch (kind) {
      case CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT:
      case PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT: {
        // Check if event_rules has credits_left property because this is the dynamic value needed by the translation key
        if (
          "credits_left" in event_rules &&
          typeof event_rules.credits_left === "number"
        ) {
          // Allow us to know if the rule is applied to every pass or just specific ones
          if (
            ("contains_all_private_passes" in event_rules &&
              event_rules.contains_all_private_passes) ||
            ("contains_all_payment_packs" in event_rules &&
              event_rules.contains_all_payment_packs)
          ) {
            return String(
              // @ts-expect-error bad plural management
              t("table.triggerType.passes.all.credit", {
                count: event_rules.credits_left,
              }),
            );
          } else {
            // If it's not applied to all, we then provide the first pass name found
            return String(
              // @ts-expect-error bad plural management
              t("table.triggerType.passes.finnerGraining.credit", {
                count: event_rules.credits_left,
                entityName,
              }),
            );
          }
        }
        return "";
      }

      case CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME:
      case PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME: {
        // Check if event_rules has days_left property because this is the dynamic value needed by the translation key
        if (
          "days_left" in event_rules &&
          typeof event_rules.days_left === "number"
        ) {
          const daysLeft = event_rules.days_left;
          // If daysLeft is positive or zero, this means the trigger is applied on pass validity
          if (daysLeft >= 0) {
            // Allow us to know if the rule is applied to every pass or just specific ones
            if (
              ("contains_all_private_passes" in event_rules &&
                event_rules.contains_all_private_passes) ||
              ("contains_all_payment_packs" in event_rules &&
                event_rules.contains_all_payment_packs)
            ) {
              return String(
                // @ts-expect-error bad plural management
                t("table.triggerType.passes.all.validity", {
                  count: daysLeft,
                }),
              );
            } else {
              return String(
                // @ts-expect-error bad plural management
                t("table.triggerType.passes.finnerGraining.validity", {
                  count: daysLeft,
                  entityName,
                }),
              );
            }
            // If daysLeft is negative, this means the trigger is applied on pass expiration
          } else {
            // Allow us to know if the rule is applied to every pass or just specific ones
            if (
              ("contains_all_private_passes" in event_rules &&
                event_rules.contains_all_private_passes) ||
              ("contains_all_payment_packs" in event_rules &&
                event_rules.contains_all_payment_packs)
            ) {
              return String(
                // @ts-expect-error bad plural management
                t("table.triggerType.passes.all.expired", {
                  count: Math.abs(daysLeft),
                }),
              );
            } else {
              return String(
                // @ts-expect-error bad plural management
                t("table.triggerType.passes.finnerGraining.expired", {
                  count: Math.abs(daysLeft),
                  entityName,
                }),
              );
            }
          }
        }
        return "";
      }

      default:
        return "";
    }
  };

  return {
    getPassesTriggerTypeTranslation,
  };
};

export {
  extractEntityId,
  findEntityName,
  extractTimingConfig,
  useGenerateBookingTriggerType,
  useGenerateSubscriptionTriggerType,
  useGeneratePassesTriggerType,
};
