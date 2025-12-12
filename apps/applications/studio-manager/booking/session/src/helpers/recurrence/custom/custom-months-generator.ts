import {
  getStartOf,
  isWithinRange,
  toDate,
} from "@bsport/datetime-manipulation";

import {
  getOccurrenceByPosition,
  getWeekdayPositionInMonth,
} from "#src/helpers/recurrence/custom/month.utils";
import {
  type CustomMonthsConfig,
  MonthlyRecurrencePattern,
} from "#src/helpers/recurrence/types";

/**
 * Custom months recurrence generator
 * Generates dates every X months with two patterns:
 * - DAY_OF_MONTH: e.g., "12th of every month"
 * - WEEKDAY_POSITION: e.g., "2nd Friday of every month"
 */
export function generateCustomMonthsDates(config: CustomMonthsConfig): Date[] {
  if (config.pattern === MonthlyRecurrencePattern.DAY_OF_MONTH) {
    return generateByDayOfMonth(config);
  } else {
    return generateByWeekdayPosition(config);
  }
}

function generateByDayOfMonth(config: CustomMonthsConfig): Date[] {
  if (!config.dayOfMonth) {
    throw new Error("dayOfMonth is required for DAY_OF_MONTH pattern");
  }

  const dates: Date[] = [];

  const startDateTime = getStartOf(config.startDate, "day", config.timezone);
  const endDateTime = getStartOf(config.endDate, "day", config.timezone);

  let current = startDateTime.startOf("month");

  // Continue while the current month could contain dates in our range
  while (current <= endDateTime) {
    // Check if the day exists in current month (e.g., Feb 31 doesn't exist)
    const targetDate = current.set({ day: config.dayOfMonth });

    if (
      targetDate.month === current.month &&
      isWithinRange(targetDate, startDateTime, endDateTime, config.timezone)
    ) {
      dates.push(toDate(targetDate));
    }

    current = current.plus({ months: config.interval });
  }

  return dates;
}

function generateByWeekdayPosition(config: CustomMonthsConfig): Date[] {
  const pattern = getWeekdayPositionInMonth(config.startDate, config.timezone);

  const dates: Date[] = [];

  const startDateTime = getStartOf(config.startDate, "day", config.timezone);
  const endDateTime = getStartOf(config.endDate, "day", config.timezone);

  let current = startDateTime.startOf("month");

  // Continue while the current month could contain dates in our range
  while (current <= endDateTime) {
    const occurrence = getOccurrenceByPosition(
      current,
      pattern.weekday,
      pattern.position,
      config.timezone,
    );

    if (
      occurrence &&
      isWithinRange(occurrence, startDateTime, endDateTime, config.timezone)
    ) {
      dates.push(toDate(occurrence));
    }

    current = current.plus({ months: config.interval });
  }

  return dates;
}
