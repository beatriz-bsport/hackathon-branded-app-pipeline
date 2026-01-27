import {
  getStartOf,
  isWithinRange,
  toDate,
  toDateTime,
} from "@bsport/datetime-manipulation";

import type { CustomWeeksConfig } from "#src/helpers/recurrence/types";
import { getSelectedWeekdays } from "#src/helpers/recurrence/weekly/utils";

/**
 * Custom weeks recurrence generator
 * Generates dates every X weeks on selected weekdays
 */
export function generateCustomWeeksDates(config: CustomWeeksConfig): Date[] {
  const selectedWeekdays = getSelectedWeekdays(config.weekdays);

  if (selectedWeekdays.length === 0) {
    return [];
  }

  const dates: Date[] = [];

  const originalDateTime = toDateTime(config.startDate, config.timezone);

  const { hour, minute, second, millisecond } = originalDateTime;

  const startDateTime = getStartOf(config.startDate, "day", config.timezone);

  const endDateTime = getStartOf(config.endDate, "day", config.timezone);

  // Find the first day of the week containing startDateTime
  let currentWeek = startDateTime.startOf("week");

  while (currentWeek <= endDateTime) {
    // Process all selected weekdays in this week
    selectedWeekdays.forEach((weekday) => {
      // Set to the specific weekday (1=Monday, 7=Sunday)
      const occurrence = currentWeek.set({
        weekday,
        hour,
        minute,
        second,
        millisecond,
      });

      if (isWithinRange(occurrence, startDateTime, endDateTime)) {
        dates.push(toDate(occurrence));
      }
    });

    // Jump to next interval week
    currentWeek = currentWeek.plus({ weeks: config.interval });
  }

  return dates;
}
