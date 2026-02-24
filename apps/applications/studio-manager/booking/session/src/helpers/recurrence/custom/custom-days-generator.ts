import {
  DateTime,
  getStartOf,
  isWithinRange,
  modifyTime,
} from "@bsport/datetime-manipulation";

import type { CustomDaysConfig } from "#src/helpers/recurrence/types";

export function generateCustomDaysDates(config: CustomDaysConfig): DateTime[] {
  const dates: DateTime[] = [];

  const startDateTime = getStartOf({
    dateTime: config.startDate,
    unit: "day",
  });
  const endDateTime = getStartOf({
    dateTime: config.endDate,
    unit: "day",
  });
  const originalDateTime = config.startDate;

  const { hour, minute, second, millisecond } = originalDateTime;

  let current = startDateTime;

  while (isWithinRange(current, startDateTime, endDateTime)) {
    const dateWithTime = current.set({
      hour,
      minute,
      second,
      millisecond,
    });
    dates.push(dateWithTime);
    current = modifyTime({
      datetime: current,
      duration: { day: config.interval },
      operator: "plus",
    });
  }

  return dates;
}
