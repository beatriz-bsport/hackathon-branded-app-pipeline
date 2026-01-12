import type {
  BookingCreationEventRules,
  MarketingNotification,
} from "@bsport/store-cdp-marketing-notification";

/**
 * Type guard to check if event rules contain meta_activity_id
 */
const hasMetaActivityId = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules & { meta_activity_id: number } => {
  return (
    "meta_activity_id" in eventRules &&
    typeof eventRules.meta_activity_id === "number" &&
    eventRules.meta_activity_id > 0
  );
};

/**
 * Type guard to check if event rules contain establishment_id
 */
const hasEstablishmentId = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules & { establishment_id: number } => {
  return (
    "establishment_id" in eventRules &&
    typeof eventRules.establishment_id === "number" &&
    eventRules.establishment_id > 0
  );
};

/**
 * Type guard to check if event rules contain private_service_id
 */
const hasPrivateServiceId = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules & { private_service_id: number } => {
  return (
    "private_service_id" in eventRules &&
    typeof eventRules.private_service_id === "number" &&
    eventRules.private_service_id > 0
  );
};

/**
 * Type guard to check if event rules are booking-related
 */
const isBookingEventRules = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules => {
  return "kind" in eventRules && typeof eventRules.kind === "number";
};

/**
 * Get function that is returning the queried key from the event_rules object of a marketing notification
 */
const getEventRuleKey = <T>({
  key,
  eventRules,
}: {
  key: string;
  eventRules: MarketingNotification["event_rules"];
}): T | undefined => {
  if (key in eventRules) {
    const value = eventRules[key as keyof typeof eventRules];
    return value as T;
  }
  return undefined;
};

export {
  hasMetaActivityId,
  hasEstablishmentId,
  hasPrivateServiceId,
  isBookingEventRules,
  getEventRuleKey,
};
