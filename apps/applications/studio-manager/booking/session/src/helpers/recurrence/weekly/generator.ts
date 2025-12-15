import {
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
export function generateWeeklyDates(config: WeeklyRecurrenceConfig): Date[] {
  const selectedWeekdays = getSelectedWeekdays(config.weekdays);

  if (selectedWeekdays.length === 0) {
    return [];
  }

  const dates: Date[] = [];

  // Convert dates to the target timezone to get the correct calendar dates
  const startDateTime = getStartOf(config.startDate, "day", config.timezone);
  const endDateTime = getStartOf(config.endDate, "day", config.timezone);

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
    dates.push(current.toJSDate());
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
