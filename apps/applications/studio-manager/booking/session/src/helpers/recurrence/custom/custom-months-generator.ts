import {
  DateTime,
  getStartOf,
  isWithinRange,
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
export function generateCustomMonthsDates(
  config: CustomMonthsConfig,
): DateTime[] {
  if (config.pattern === MonthlyRecurrencePattern.DAY_OF_MONTH) {
    return generateByDayOfMonth(config);
  } else {
    return generateByWeekdayPosition(config);
  }
}

function generateByDayOfMonth(config: CustomMonthsConfig): DateTime[] {
  if (!config.dayOfMonth) {
    throw new Error("dayOfMonth is required for DAY_OF_MONTH pattern");
  }

  const dates: DateTime[] = [];

  const originalDateTime = config.startDate;
  const { hour, minute, second, millisecond } = originalDateTime;

  const startDateTime = getStartOf({
    dateTime: config.startDate,
    unit: "day",
  });

  const endDateTime = getStartOf({
    dateTime: config.endDate,
    unit: "day",
  });

  let current = getStartOf({
    dateTime: startDateTime,
    unit: "month",
  });

  // Continue while the current month could contain dates in our range
  while (current <= endDateTime) {
    // Check if the day exists in current month (e.g., Feb 31 doesn't exist)

    const targetDate = current.set({
      day: config.dayOfMonth,
      hour,
      minute,
      second,
      millisecond,
    });

    if (
      targetDate.month === current.month &&
      isWithinRange(targetDate, startDateTime, endDateTime, config.timezone)
    ) {
      dates.push(targetDate);
    }

    current = current.plus({ months: config.interval });
  }

  return dates;
}

function generateByWeekdayPosition(config: CustomMonthsConfig): DateTime[] {
  const pattern = getWeekdayPositionInMonth(config.startDate, config.timezone);

  const dates: DateTime[] = [];

  const originalDateTime = config.startDate;
  const { hour, minute, second, millisecond } = originalDateTime;

  const startDateTime = getStartOf({
    dateTime: config.startDate,
    unit: "day",
  });

  const endDateTime = getStartOf({
    dateTime: config.endDate,
    unit: "day",
  });

  let current = getStartOf({
    dateTime: startDateTime,
    unit: "month",
  });

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
      const occurrenceWithTime = occurrence.set({
        hour,
        minute,
        second,
        millisecond,
      });
      dates.push(occurrenceWithTime);
    }

    current = current.plus({ months: config.interval });
  }

  return dates;
}
