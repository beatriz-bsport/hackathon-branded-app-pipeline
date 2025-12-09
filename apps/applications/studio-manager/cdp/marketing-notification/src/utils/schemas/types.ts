import type { BookingTemporality } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";
import type { SelectableNotificationType } from "#src/utils/types";

export type TriggerTypeValidationFormData = {
  notificationType: SelectableNotificationType;
  itemIds?: number[];
};

export type ConfigTimeUnit = "hour" | "day";

export type BookingSelectableNotificationType = Omit<
  SelectableNotificationType,
  "birthday" | "privatePass" | "paymentPack" | "subscription"
>;

export type BookingTriggerConfigValidationFormData = {
  notificationType: BookingSelectableNotificationType;
  bookingEventKind: number;
  bookingOccurrence: number;
  bookingItemId: number;
  timingUnit: ConfigTimeUnit;
  timingValue: number;
  timingTemporality: BookingTemporality;
  toggleIncludedSmartlists: boolean;
  includedSmartlists?: number[];
  toggleExcludedSmartlists: boolean;
  excludedSmartlists?: number[];
};

export type NotificationContentFormData = {
  isEmailNotificationChecked: boolean;
  isPushNotificationChecked: boolean;
  emailTemplateId?: number;
  pushNotificationTitle?: string;
  pushNotificationContent?: string;
};
