import { DateTime } from "@bsport/datetime-manipulation";

import { SessionEdit } from "#src/stores/session-creation/types";

export type LevelFormData = {
  name: string;
  color: string;
};

export type SessionEditFormData = Omit<
  SessionEdit,
  "id" | "date_start" | "coach" | "establishment"
> & {
  // Form uses Date instead of ISO string
  startDateTime: DateTime;

  // Non-nullable in edit form
  coach: number;
  establishment: number;

  // Form-specific fields
  recurrence_id?: string;
  overrideTeacherPayrollRule: boolean;
  roomBlueprintCapacity: number | null;
};
