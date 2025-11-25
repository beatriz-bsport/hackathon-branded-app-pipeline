import type { ManagerSession } from "@bsport/store-booking-session";

export type EnrichedSession = Omit<ManagerSession, "name_override"> & {
  color?: string;
  teacherName?: string;
  establishmentName?: string;
};
