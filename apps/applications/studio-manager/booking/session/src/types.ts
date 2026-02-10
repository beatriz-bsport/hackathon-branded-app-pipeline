import { ZodError } from "zod";

import type { ManagerSession } from "@bsport/api-book";
import { type DateTime } from "@bsport/datetime-manipulation";
import { GenericTableColumn } from "@bsport/kaizen-primitive-core";

// Careful, name is always present and represents the final name after overrides
export type EnrichedSession = ManagerSession & {
  color?: string;
  teacherName?: string;
  originalTeacherName?: string;
  establishmentName?: string;
  hasPendingReplacementRequest?: boolean;
  // Name of the group session if the session is part of a group session
  groupName?: string;
  isTeacherArchived?: boolean;
  isEstablishmentArchived?: boolean;
  isMetaActivityArchived?: boolean;
};

export type TableColumn = GenericTableColumn<EnrichedSession> & {
  label: string;
};

export enum Columns {
  TIME = "time",
  SESSION_NAME = "sessionName",
  TEACHER = "teacher",
  PARTICIPANTS = "participants",
  ESTABLISHMENT = "establishment",
  SESSION_TYPE = "sessionType",
  ACTIONS = "actions",
}

export enum CalendarView {
  DAILY = "daily",
  RANGE = "range",
}

export type DateSelection =
  | { type: "single"; date: DateTime }
  | { type: "range"; minDate: DateTime | null; maxDate: DateTime | null };

export enum ModalType {
  CANCEL = "cancel",
  RESTORE = "restore",
  DELETE = "delete",
  DUPLICATE = "duplicate",
}

export type ModalState = { type: ModalType; session: EnrichedSession } | null;

export type SafeEventError = {
  eventType: string;
  zodError: ZodError;
};

export type SafeEventResult<T> = {
  event: T;
  errors: SafeEventError | null;
};
