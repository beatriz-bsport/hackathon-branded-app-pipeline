import type { ManagerSession } from "@bsport/store-booking-session";

// Internal enriched session used within the store actions
// This is before the processing that adds name and color
export type InternalEnrichedSession = ManagerSession & {
  teacherName?: string;
  originalTeacherName?: string;
  establishmentName?: string;
};

export type EnrichedSession = Omit<ManagerSession, "name_override"> & {
  color?: string;
  teacherName?: string;
  originalTeacherName?: string;
  establishmentName?: string;
};
