import {
  getStartOf,
  isWithinRange,
  modifyTime,
  toDate,
} from "@bsport/datetime-manipulation";

import type { CustomDaysConfig } from "#src/helpers/recurrence/types";

export function generateCustomDaysDates(config: CustomDaysConfig): Date[] {
  const dates: Date[] = [];

  const startDateTime = getStartOf(config.startDate, "day", config.timezone);
  const endDateTime = getStartOf(config.endDate, "day", config.timezone);

  let current = startDateTime;

  while (isWithinRange(current, startDateTime, endDateTime)) {
    dates.push(toDate(current));
    current = modifyTime({
      datetime: current,
      duration: { day: config.interval },
      operator: "plus",
    });
  }

  return dates;
}
