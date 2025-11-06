import type { BookingTemporality } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";
import type { SelectableNotificationType } from "#src/utils/types";

export type TriggerTypeValidationFormData = {
  notificationType: SelectableNotificationType;
  itemIds?: number[];
};

export type ConfigTimeUnit = "hour" | "day";

export type BookingSelectableNotificationType = Omit<
  SelectableNotificationType,
  "birthday" | "privatePass" | "privateService" | "paymentPack" | "subscription"
>;

export type BookingTriggerConfigValidationFormData = {
  notificationType: BookingSelectableNotificationType;
  bookingEventKind: number;
  bookingOccurrence: number;
  bookingItemId: number;
  timingUnit: ConfigTimeUnit;
  timingValue: number;
  timingTemporality: BookingTemporality;
  includedSmartlists?: number[];
  excludedSmartlists?: number[];
};
