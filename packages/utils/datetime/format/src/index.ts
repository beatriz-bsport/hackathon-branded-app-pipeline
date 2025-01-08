import { DateTime } from "luxon";

export const DATE_FORMATS = {
  LOCALE_LONG: DateTime.DATE_FULL,
  LOCALE_SHORT: DateTime.DATE_SHORT,
} as const;
