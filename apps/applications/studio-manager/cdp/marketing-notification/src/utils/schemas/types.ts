import { SelectableNotificationType } from "../types";

export type TriggerTypeValidationFormData = {
  notificationType: SelectableNotificationType;
  itemIds?: number[];
};

export type TriggerConfigValidationFormData = {
  notificationType: SelectableNotificationType;
  notificationKind?: number;
  notificationName?: string;
  eventOccurrence?: number;
  itemIds?: number[];
  shouldIncludeAllItems?: boolean;
  disabledInContract?: boolean;
  timingUnit?: "hours" | "days" | "days_left";
  timingValue?: number;
  includedSmartlists?: number[];
  excludedSmartlists?: number[];
};
