import type { ManagerSession } from "@bsport/api-book";

export type EnrichedSession = Omit<ManagerSession, "name_override"> & {
  color?: string;
  teacherName?: string;
  originalTeacherName?: string;
  establishmentName?: string;
};
