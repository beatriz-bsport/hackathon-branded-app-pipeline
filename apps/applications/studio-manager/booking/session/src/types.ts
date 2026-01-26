import type { ManagerSession } from "@bsport/api-book";
import { GenericTableColumn } from "@bsport/kaizen-primitive-core";

export type EnrichedSession = Omit<ManagerSession, "name_override"> & {
  color?: string;
  teacherName?: string;
  originalTeacherName?: string;
  establishmentName?: string;
  hasPendingReplacementRequest?: boolean;
  // Name of the group session if the session is part of a group session
  groupName?: string;
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
