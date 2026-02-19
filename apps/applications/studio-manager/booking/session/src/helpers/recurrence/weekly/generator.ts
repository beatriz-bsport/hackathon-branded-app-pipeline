import {
  DateTime,
  getStartOf,
  isWithinRange,
  modifyTime,
} from "@bsport/datetime-manipulation";

import type { WeeklyRecurrenceConfig } from "#src/helpers/recurrence/types";

import { findNextMatchingWeekday, getSelectedWeekdays } from "./utils";

/**
 * Weekly recurrence generator
 * Generates dates on selected weekdays every week
 */
export function generateWeeklyDates(
  config: WeeklyRecurrenceConfig,
): DateTime[] {
  const selectedWeekdays = getSelectedWeekdays(config.weekdays);

  if (selectedWeekdays.length === 0) {
    return [];
  }

  const dates: DateTime[] = [];

  // Convert dates to the target timezone to get the correct calendar dates
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

  // Start from the first selected weekday on or after start date
  const firstMatch = findNextMatchingWeekday(
    current,
    selectedWeekdays,
    config.timezone,
  );
  if (
    !firstMatch ||
    !isWithinRange(firstMatch, startDateTime, endDateTime, config.timezone)
  ) {
    return [];
  }

  current = firstMatch;

  while (isWithinRange(current, startDateTime, endDateTime, config.timezone)) {
    const dateWithTime = current.set({
      hour,
      minute,
      second,
      millisecond,
    });
    dates.push(dateWithTime);
    const next = findNextMatchingWeekday(
      modifyTime({
        datetime: current,
        duration: { day: 1 },
        operator: "plus",
      }),
      selectedWeekdays,
      config.timezone,
    );
    if (!next) break;

    current = next;
  }

  return dates;
}
