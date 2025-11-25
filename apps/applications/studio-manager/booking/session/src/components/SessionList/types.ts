import type { ProcessedManagerSession } from "@bsport/store-booking-session";

export type TableRowData = ProcessedManagerSession & {
  teacherName?: string;
  establishmentName?: string;
};
