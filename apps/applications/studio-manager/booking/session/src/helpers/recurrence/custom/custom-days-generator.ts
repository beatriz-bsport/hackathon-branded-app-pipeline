import {
  getStartOf,
  isWithinRange,
  modifyTime,
  toDateTime,
} from "@bsport/datetime-manipulation";

import type { CustomDaysConfig } from "#src/helpers/recurrence/types";

export function generateCustomDaysDates(config: CustomDaysConfig): Date[] {
  const dates: Date[] = [];

  const startDateTime = getStartOf(config.startDate, "day", config.timezone);
  const endDateTime = getStartOf(config.endDate, "day", config.timezone);
  const originalDateTime = toDateTime(config.startDate, config.timezone);

  const { hour, minute, second, millisecond } = originalDateTime;

  let current = startDateTime;

  while (isWithinRange(current, startDateTime, endDateTime)) {
    const dateWithTime = current.set({
      hour,
      minute,
      second,
      millisecond,
    });
    dates.push(dateWithTime.toJSDate());
    current = modifyTime({
      datetime: current,
      duration: { day: config.interval },
      operator: "plus",
    });
  }

  return dates;
}
