/**
 * Month and day utility functions for monthly recurrence patterns
 * Uses Luxon for date calculations
 */
import {
  type DateTime,
  getISOWeekday,
  modifyTime,
  toDateTime,
} from "@bsport/datetime-manipulation";

import type {
  ISOWeekday,
  WeekdayPosition,
} from "#src/helpers/recurrence/types";

/**
 * Get which occurrence of a weekday a date is in its month
 * e.g., Dec 12, 2025 (Friday) -> { position: 2, weekday: 5 }
 */
export function getWeekdayPositionInMonth(
  date: Date,
  zone: string,
): WeekdayPosition {
  const dateTime = toDateTime(date, zone);
  const weekday = getISOWeekday(dateTime, zone);
  const dayOfMonth = dateTime.day;

  let position = Math.floor((dayOfMonth - 1) / 7) + 1;

  // Check if it's the last occurrence
  const nextWeek = modifyTime({
    datetime: toDateTime(date, zone),
    duration: { week: 1 },
    operator: "plus",
  });

  // If the month has changed, it's the last occurrence
  // position is -1 for last
  if (nextWeek.month !== dateTime.month) {
    position = -1;
  }

  return {
    position: position as WeekdayPosition["position"],
    weekday,
  };
}

/**
 * Get a specific occurrence of a weekday in a month
 * @param monthStart - First day of the target month
 * @param weekday - Target weekday (1-7)
 * @param position - Which occurrence (1-4, or -1 for last)
 */
export function getOccurrenceByPosition(
  monthStart: DateTime,
  weekday: ISOWeekday,
  position: 1 | 2 | 3 | 4 | -1,
  zone: string,
): DateTime | null {
  if (position === -1) {
    return getLastOccurrence(monthStart, weekday, zone);
  }

  // Find first occurrence of weekday
  let current = monthStart.setZone(zone ?? monthStart.zone).startOf("month");
  const targetMonth = current.month;

  while (
    getISOWeekday(current, zone) !== weekday &&
    current.month === targetMonth
  ) {
    current = modifyTime({
      datetime: current.setZone(zone ?? current.zone),
      duration: { day: 1 },
      operator: "plus",
    });
  }

  // Every month has at least 28 days,
  // which means every month contains at least 4 occurrences of each weekday.
  // This is a defensive guard that would only catch bugs in
  // the loop logic above it (like if the loop accidentally skipped over valid days).
  if (current.month !== targetMonth) {
    return null;
  }

  // Jump to the Nth occurrence
  const targetDate = modifyTime({
    datetime: current.setZone(zone ?? current.zone),
    duration: { week: position - 1 },
    operator: "plus",
  });

  if (targetDate.month !== targetMonth) {
    return null;
  }

  return targetDate;
}

/**
 * Get the last occurrence of a weekday in a month
 */
function getLastOccurrence(
  monthStart: DateTime,
  weekday: ISOWeekday,
  zone: string,
): DateTime | null {
  let current = monthStart.endOf("month");
  const targetMonth = current.month;

  while (
    getISOWeekday(current, zone) !== weekday &&
    current.month === targetMonth
  ) {
    current = modifyTime({
      datetime: current.setZone(zone ?? current.zone),
      duration: { day: 1 },
      operator: "minus",
    });
  }

  // Every month has at least 28 days,
  // which means every month contains at least 4 occurrences of each weekday.
  // This is a defensive guard that would only catch bugs in
  // the loop logic above it (like if the loop accidentally skipped over valid days).
  if (current.month !== targetMonth) {
    return null;
  }

  return current;
}
