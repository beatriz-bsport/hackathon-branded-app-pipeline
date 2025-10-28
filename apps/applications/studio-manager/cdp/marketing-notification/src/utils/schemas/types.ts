import { SelectableNotificationType } from "../types";

export type TriggerTypeValidationFormData = {
  notificationType: SelectableNotificationType;
  itemIds?: number[];
};
