import type { ManagerSession } from "@bsport/api-book";

export type EnrichedSession = Omit<ManagerSession, "name_override"> & {
  color?: string;
  teacherName?: string;
  originalTeacherName?: string;
  establishmentName?: string;
  hasPendingReplacementRequest?: boolean;
  // Name of the group session if the session is part of a group session
  groupName?: string;
};
