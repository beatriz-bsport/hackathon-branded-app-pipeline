import type {
  TemporalityType,
  TimeUnitType,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Common/types";
import type {
  PassAction,
  PassCreditsLeftEventKind,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Pass/types";

import { SelectableNotificationType } from "../types";

export type TriggerTypeValidationFormData = {
  draftMarketingNotificationId?: number;
  notificationType: SelectableNotificationType;
  itemIds?: number[];
  shouldContainAllPasses?: boolean;
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
} & CommonTriggerConfigValidationFormData &
  TimeTriggerConfigValidationFormData;

export type SubscriptionTriggerConfigValidationFormData = {
  subscriptionEventKind: number;
  contractId: number;
} & CommonTriggerConfigValidationFormData &
  TimeTriggerConfigValidationFormData;

export const PAYMENT_PACK_TYPE = "paymentPack";
export const PRIVATE_PASS_TYPE = "privatePass";

export type PassesType = typeof PAYMENT_PACK_TYPE | typeof PRIVATE_PASS_TYPE;

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
