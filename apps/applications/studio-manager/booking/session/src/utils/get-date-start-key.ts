import { fromIsoString } from "@bsport/datetime-manipulation";
import { getCompanyTimezone } from "@bsport/timezone-utils";

export const getDateStartKey = (item: { date_start: string }): string => {
  return fromIsoString(item.date_start, {
    zone: getCompanyTimezone(),
  }).toISODate()!;
};
