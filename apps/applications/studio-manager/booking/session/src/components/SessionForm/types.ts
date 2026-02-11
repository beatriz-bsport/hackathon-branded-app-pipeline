import {
  SessionCreationFormAdvancedOptionsData,
  SessionCreationFormData,
  SessionEdit,
} from "#src/stores/session-creation/types";

export type LevelFormData = {
  name: string;
  color: string;
};

export type SessionEditFormData = SessionCreationFormData &
  SessionCreationFormAdvancedOptionsData &
  Pick<
    SessionEdit,
    | "id"
    | "meta_activity"
    | "coach_override"
    | "credit_price_override"
    | "custom_selection_ids"
    | "custom_selection"
    | "modifyAllDates"
    | "notifyConsumers"
    | "propagate_coach_override_value"
  > & {
    overrideTeacherPayrollRule: boolean;
  };
