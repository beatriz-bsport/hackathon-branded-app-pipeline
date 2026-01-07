import type {
  TemporalityType,
  TimeUnitType,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Common/types";

import { SelectableNotificationType } from "../types";

export type TriggerTypeValidationFormData = {
  notificationType: SelectableNotificationType;
  itemIds?: number[];
};

export type BookingSelectableNotificationType = Omit<
  SelectableNotificationType,
  "birthday" | "privatePass" | "paymentPack" | "subscription"
>;

export type BookingTriggerConfigValidationFormData = {
  notificationType: BookingSelectableNotificationType;
  bookingEventKind: number;
  bookingOccurrence: number;
  bookingItemId: number;
} & CommonTriggerConfigValidationFormData;

export type SubscriptionTriggerConfigValidationFormData = {
  subscriptionEventKind: number;
  contractId: number;
} & CommonTriggerConfigValidationFormData;

export type CommonTriggerConfigValidationFormData = {
  timingUnit: TimeUnitType;
  timingValue: number;
  timingTemporality: TemporalityType;
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
