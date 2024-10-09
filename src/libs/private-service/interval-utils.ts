import { DateTime, Interval } from 'luxon';
import { DayTimeIntervals } from '#src/libs/private-service/constants';

/**
 * Generates an object containing time intervals for different periods of the specified date.
 *
 * @param {string} isoDate - A date string in ISO format (yyyy-MM-dd) to define the intervals.
 * @returns {Object} An object with properties for each time period of the day:
 * - `morning`: Interval from 00:00 to 12:00
 * - `noon`: Interval from 12:00 to 14:00
 * - `afternoon`: Interval from 14:00 to 18:00
 * - `evening`: Interval from 18:00 to 24:00
 *
 * Each DayTime Interval is represented by a Luxon `Interval` object that captures the start and end DateTime.
 *
 * @example
 * // Returns an object with morning, noon, afternoon, and evening intervals
 * getDayTimeIntervals('2023-10-05');
 */
export const getDayTimeIntervals = (isoDate: string) => {
  /**
   * Validate if the date string is in ISO format (yyyy-MM-dd)
   * We don't want to use fromISO as fromFormat is more restrictive.
   * e.g if we give an incomplete date (2023-10) fromISO will parse it with the first day of the month.
   */
  let dateTime = DateTime.fromFormat(isoDate, 'yyyy-MM-dd');

  if (!dateTime.isValid) {
    console.error(
      `Invalid date provided: ${isoDate}. Reason: ${dateTime.invalidExplanation}`,
    );
    dateTime = DateTime.now();
  }

  return {
    [DayTimeIntervals.MORNING]: Interval.fromDateTimes(
      dateTime.set({ hour: 0 }),
      dateTime.set({ hour: 12 }),
    ),
    [DayTimeIntervals.NOON]: Interval.fromDateTimes(
      dateTime.set({ hour: 12 }),
      dateTime.set({ hour: 14 }),
    ),
    [DayTimeIntervals.AFTERNOON]: Interval.fromDateTimes(
      dateTime.set({ hour: 14 }),
      dateTime.set({ hour: 18 }),
    ),
    [DayTimeIntervals.EVENING]: Interval.fromDateTimes(
      dateTime.set({ hour: 18 }),
      dateTime.set({ hour: 23, minute: 59, second: 59 }),
    ),
  };
};
