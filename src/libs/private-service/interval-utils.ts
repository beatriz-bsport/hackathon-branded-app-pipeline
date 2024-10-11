import { DateTime, Interval } from 'luxon';
import { DayTimeIntervals } from '#src/libs/private-service/constants';
import type { Slot } from '#src/libs/private-service/types';

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

/**
 * Converts a time slot array into a Luxon `Interval` object.
 *
 * @param {string[]} slot - An array with two ISO 8601 date-time strings:
 *  - `slot[0]` should represent the start date-time in ISO format.
 *  - `slot[1]` should represent the end date-time in ISO format.
 * @returns {Interval} A Luxon `Interval` object representing the period between the start and end date-times.
 *
 * @example
 * // Converts a time slot to an interval
 * convertSlotToInterval(['2023-10-05T08:00:00', '2023-10-05T10:00:00']);
 */
export const convertSlotToInterval = (slot: Slot) => {
  if (slot?.length !== 2) {
    throw new Error(
      'Slot must be an array containing exactly two date-time strings.',
    );
  }
  const [start, end] = slot;

  // Validate that both `start` and `end` are valid ISO date-time strings
  let startDateTime = DateTime.fromISO(start);
  let endDateTime = DateTime.fromISO(end);

  if (!startDateTime.isValid) {
    console.error(
      `Invalid start date-time: ${start}. Reason: ${startDateTime.invalidExplanation}`,
    );
    startDateTime = DateTime.now();
  }

  if (!endDateTime.isValid) {
    console.error(
      `Invalid end date-time: ${end}. Reason: ${endDateTime.invalidExplanation}`,
    );
    endDateTime = startDateTime.plus({ hours: 1 });
  }

  if (startDateTime.toMillis() > endDateTime.toMillis()) {
    console.error('The slot start time should be before the end time.');
    endDateTime = startDateTime.plus({ hours: 1 });
  }

  return Interval.fromDateTimes(startDateTime, endDateTime);
};

/**
 * Retrieves a set of unique availability day time segments (e.g., morning, afternoon, etc.) based on provided time slots.
 *
 * This function determines which predefined day time segments overlap with the given availability slots for a specific date.
 * It returns a set of day time segments names (up to 4) that have overlapping time slots.
 *
 * @param {string} date - The date for which to get available day time segments in YYYY-MM-DD format.
 * @param {Slot[]} slots - An array of availability slots where each slot is an object representing a start and end time.
 *
 * @returns {Set<string>} A set of day time segments names that have at least one overlapping slot.
 *                        If four day time segments are found, the function returns early to optimize performance.
 *
 * @example
 * // Example usage:
 * const date = "2024-10-04";
 * const slots = [
 *   ["2024-10-04T06:00:00Z", "2024-10-04T11:00:00Z"],
 *   ["2024-10-04T12:00:00Z", "2024-10-04T13:00:00Z" ]
 * ];
 *
 * const availableDayTimeSegments = getAvailableDayTimeSegments(date, slots);
 * console.log(availableDayTimeSegments); // Output could be: Set { "morning", "noon" }
 */
export const getAvailableDayTimeSegments = (isoDate: string, slots: Slot[]) => {
  const dayTimeIntervals = getDayTimeIntervals(isoDate);

  const numberOfDayTimeIntervals = Object.keys(dayTimeIntervals).length;

  const availableDayTimeSegments = (slots ?? []).reduce<Set<DayTimeIntervals>>(
    (availableDayTimeSegmentsSet, slot) => {
      const slotInterval = convertSlotToInterval(slot);
      Object.entries(dayTimeIntervals).every(
        ([dayTimeSegment, dayTimeInterval]) => {
          if (availableDayTimeSegmentsSet.size === numberOfDayTimeIntervals) {
            return false;
          }
          if (slotInterval.overlaps(dayTimeInterval))
            availableDayTimeSegmentsSet.add(dayTimeSegment as DayTimeIntervals);
          return true;
        },
      );
      return availableDayTimeSegmentsSet;
    },
    new Set<DayTimeIntervals>(),
  );

  return availableDayTimeSegments;
};

/**
 * Retrieves the available day-time intervals based on the provided ISO date and available time slots.
 *
 * This function calculates the day-time intervals (e.g., morning, noon, afternoon, evening) for a given day,
 * then checks the available slots and returns only those intervals that match the available time segments.
 *
 * @param {string} isoDate - The date in ISO format (yyyy-MM-dd) for which to calculate the day-time intervals.
 * @param {Slot[]} slots - An array of `Slot` objects representing available time slots for the day.
 *
 * @returns {Record<DayTimeIntervals, Interval<true> | Interval<false>>}
 *   An object where the keys are day-time intervals (e.g., morning, noon, afternoon, evening)
 *   and the values are corresponding Luxon `Interval` objects. Only the intervals that match the available time segments are included.
 *
 * @example
 * const isoDate = "2024-10-18";
 * const slots = [
 *   ["2024-10-18T08:00:00Z", "2024-10-18T10:00:00Z"],
 *   ["2024-10-18T14:00:00Z", "2024-10-18T16:00:00Z"]
 * ];
 * const availableIntervals = getAvailableDayTimeIntervals(isoDate, slots);
 *
 * // availableIntervals will contain intervals for the morning and afternoon segments if they overlap with the provided slots.
 */
export const getAvailableDayTimeIntervals = (
  isoDate: string,
  slots: Slot[],
) => {
  const dayTimeIntervals = getDayTimeIntervals(isoDate);
  const availableDayTimeSegments = getAvailableDayTimeSegments(isoDate, slots);

  const availableDayTimeIntervals = Array.from(availableDayTimeSegments).reduce<
    Record<DayTimeIntervals, Interval<true> | Interval<false>>
  >((dayTimeIntervalsAcc, dayTimeSegment) => {
    if (dayTimeSegment in dayTimeIntervals) {
      dayTimeIntervalsAcc[dayTimeSegment] = dayTimeIntervals[dayTimeSegment];
    }
    return dayTimeIntervalsAcc;
  }, {} as Record<DayTimeIntervals, Interval<true> | Interval<false>>);

  return availableDayTimeIntervals;
};

/**
 * Returns a list of intervals representing the intersection between each slot and a selected interval.
 *
 * This function converts each slot to a Luxon `Interval` and calculates the intersection with the provided
 * `interval`.
 *
 * @param {Interval} interval - The Luxon `Interval` to check for intersections with each slot.
 * @param {Slot[]} slots - An array of slots, where each slot represents a start and end time.
 *
 * @returns {Interval[]} An array of `Interval` objects, where each entry represents
 *                                the intersection of the slot with the `interval`.
 *
 * @example
 * // Example usage:
 * const interval = Interval.fromDateTimes(
 *   DateTime.fromISO("2024-10-04T09:00:00Z"),
 *   DateTime.fromISO("2024-10-04T12:00:00Z")
 * );
 * const slots = [
 *   ["2024-10-04T08:00:00Z","2024-10-04T10:00:00Z"],
 *   ["2024-10-04T11:00:00Z","2024-10-04T13:00:00Z"]
 * ];
 *
 * const intersections = getIntersectingSlots(interval, slots);
 * console.log(intersections);
 * // Output: [Interval.fromDateTimes("2024-10-04T09:00:00Z", "2024-10-04T10:00:00Z"),
 * //          Interval.fromDateTimes("2024-10-04T11:00:00Z", "2024-10-04T12:00:00Z")]
 */
export const getIntersectingSlots = (interval: Interval, slots: Slot[]) => {
  if (!slots || !interval || !interval?.isValid) return [];
  return slots
    .map((slot) => {
      const slotInterval = convertSlotToInterval(slot);
      return interval.intersection(slotInterval);
    })
    .filter((intersectingSlot) => !!intersectingSlot);
};
