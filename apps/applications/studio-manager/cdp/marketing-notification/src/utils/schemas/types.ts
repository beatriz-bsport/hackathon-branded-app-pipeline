import type {
  BookingAction,
  BookingOccurrenceType,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Booking/types";
import type {
  TemporalityType,
  TimeUnitType,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Common/types";
import type {
  PassAction,
  PassCreditsLeftEventKind,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Pass/types";

import {
  APPOINTMENT_PASS_TYPE,
  BIRTHDAY_TYPE,
  type NotificationType,
  PASS_TYPE,
  type PassesType,
  SUBSCRIPTION_TYPE,
} from "../types";

export type TriggerTypeValidationFormData = {
  draftMarketingNotificationId?: number;
  notificationType: NotificationType;
  itemIds?: number[];
  shouldContainAllPasses?: boolean;
};

export type BookingSelectableNotificationType = Exclude<
  NotificationType,
  | typeof BIRTHDAY_TYPE
  | typeof PASS_TYPE
  | typeof APPOINTMENT_PASS_TYPE
  | typeof SUBSCRIPTION_TYPE
>;

export type BookingTriggerConfigValidationFormData = {
  notificationType: BookingSelectableNotificationType;
  bookingEventKind: number;
  bookingOccurrence: number;
  bookingOccurrenceType: BookingOccurrenceType;
  bookingActionType: BookingAction;
  bookingItemId: number;
} & CommonTriggerConfigValidationFormData &
  TimeTriggerConfigValidationFormData;

export type SubscriptionTriggerConfigValidationFormData = {
  subscriptionEventKind: number;
  contractId: number;
} & CommonTriggerConfigValidationFormData &
  TimeTriggerConfigValidationFormData;

export type PassTriggerConfigValidationFormData = {
  name: string;
  passEventAction: PassAction;
  passIds: number[];
  passesType: PassesType;
  daysLeft?: number;
  shouldContainAllPasses: boolean;
  isPassExpirationCheck: boolean;
  disabledInContract: boolean;
  creditsLeft?: number;
  hours?: number;
  creditsEventKind?: PassCreditsLeftEventKind;
} & CommonTriggerConfigValidationFormData;

export type TimeTriggerConfigValidationFormData = {
  timingUnit: TimeUnitType;
  timingValue: number;
  timingTemporality: TemporalityType;
};

export type CommonTriggerConfigValidationFormData = {
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
