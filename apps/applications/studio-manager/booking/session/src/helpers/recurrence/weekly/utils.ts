import {
  type DateTime,
  getISOWeekday,
  modifyTime,
} from "@bsport/datetime-manipulation";

import { ISOWeekday, WeekdaySelection } from "#src/helpers/recurrence/types";

/**
 * Convert weekday selection object to array of selected days
 */
export function getSelectedWeekdays(selection: WeekdaySelection): ISOWeekday[] {
  return Object.keys(selection)
    .filter((day) => selection[Number(day) as ISOWeekday])
    .map((day) => Number(day) as ISOWeekday)
    .sort((a, b) => a - b);
}

/**
 * Find the next occurrence of target weekdays from a given date
 * Returns the date itself if it matches, otherwise the next matching date
 * example: findNextMatchingWeekday(new Date('2025-12-01') // Monday , [1,3,5]) => 2025-12-01 (Monday)
 * example: findNextMatchingWeekday(new Date('2025-12-01') // Momday, [3,5]) => 2025-12-03 (Wednesday)
 */
export function findNextMatchingWeekday(
  fromDate: DateTime,
  targetWeekdays: ISOWeekday[],
  timezone: string,
): DateTime | null {
  if (targetWeekdays.length === 0) return null;

  for (let index = 0; index < 7; index++) {
    const candidate = modifyTime({
      datetime: fromDate,
      duration: { day: index },
      operator: "plus",
    });

    if (targetWeekdays.includes(getISOWeekday(candidate, timezone))) {
      return candidate;
    }
  }

  return null;
}
