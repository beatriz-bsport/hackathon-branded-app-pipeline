export type BookingHourRangeFormValue = {
  hour: string;
  hourSecond: string;
};

export type BookingHourRangeInputValue = {
  hour: string | null | undefined;
  hourSecond: string | null | undefined;
};

export type BookingHourRangeDefaults = BookingHourRangeFormValue;

export const TIME_HH_MM_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const MINUTES_IN_HOUR_LIMIT = 59;
const HOURS_IN_DAY_LIMIT = 23;
const MERIDIEM_HOURS_IN_DAY_LIMIT = 12;

const formatHourMinute = (hours: number, minutes: number): string =>
  `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

/**
 * Parses common time string shapes into hour/minute parts, or null when invalid.
 */
const parseLooseTimeParts = (
  time: string,
): { hours: number; minutes: number } | null => {
  const twentyFourHourMatch = time.match(/^(\d{1,2}):(\d{1,2})(?::\d{1,2})?$/);
  if (twentyFourHourMatch) {
    const hours = Number(twentyFourHourMatch[1]);
    const minutes = Number(twentyFourHourMatch[2]);
    if (
      hours >= 0 &&
      hours <= HOURS_IN_DAY_LIMIT &&
      minutes >= 0 &&
      minutes <= MINUTES_IN_HOUR_LIMIT
    ) {
      return { hours, minutes };
    }
    return null;
  }

  const meridiemMatch = time.match(/^(\d{1,2}):(\d{1,2})\s*(AM|PM)$/i);
  if (meridiemMatch) {
    let hours = Number(meridiemMatch[1]);
    const minutes = Number(meridiemMatch[2]);
    const meridiem = meridiemMatch[3].toUpperCase();

    if (
      hours < 1 ||
      hours > MERIDIEM_HOURS_IN_DAY_LIMIT ||
      minutes < 0 ||
      minutes > MINUTES_IN_HOUR_LIMIT
    ) {
      return null;
    }

    if (meridiem === "AM") {
      hours = hours === MERIDIEM_HOURS_IN_DAY_LIMIT ? 0 : hours;
    } else {
      hours =
        hours === MERIDIEM_HOURS_IN_DAY_LIMIT
          ? MERIDIEM_HOURS_IN_DAY_LIMIT
          : hours + MERIDIEM_HOURS_IN_DAY_LIMIT;
    }

    return { hours, minutes };
  }

  return null;
};

/**
 * Returns whether a non-empty hour-range input cannot be parsed as a valid time.
 * Empty values are allowed and fall back to defaults on save.
 */
export const isInvalidHourRangeTimeInput = (
  time: string | null | undefined,
): boolean => {
  if (!time?.trim()) {
    return false;
  }

  const trimmedTime = time.trim();
  if (TIME_HH_MM_PATTERN.test(trimmedTime)) {
    return false;
  }

  return parseLooseTimeParts(trimmedTime) === null;
};

/**
 * Normalizes a time string to strict `HH:mm` (24-hour) or returns the fallback.
 */
export const normalizeHourRangeTime = (
  time: string | null | undefined,
  fallback: string,
): string => {
  if (!time?.trim()) {
    return fallback;
  }

  const trimmedTime = time.trim();
  if (TIME_HH_MM_PATTERN.test(trimmedTime)) {
    return trimmedTime;
  }

  const parsedTime = parseLooseTimeParts(trimmedTime);
  if (!parsedTime) {
    return fallback;
  }

  const normalizedTime = formatHourMinute(parsedTime.hours, parsedTime.minutes);
  return TIME_HH_MM_PATTERN.test(normalizedTime) ? normalizedTime : fallback;
};

/**
 * Ensures hour-range form values are valid `HH:mm` strings for UI and validation.
 */
export const normalizeBookingHourRangeFormValue = (
  bookingHourRange: BookingHourRangeInputValue,
  defaults: BookingHourRangeDefaults,
): BookingHourRangeFormValue => ({
  hour: normalizeHourRangeTime(bookingHourRange.hour, defaults.hour),
  hourSecond: normalizeHourRangeTime(
    bookingHourRange.hourSecond,
    defaults.hourSecond,
  ),
});

/**
 * Parses an `HH:mm` string into minutes from midnight for range comparison.
 *
 * @param time - Time string in 24-hour `HH:mm` format.
 */
export const parseHourRangeTimeToMinutes = (time: string): number => {
  const [hoursString, minutesString] = time.split(":");
  const hours = Number(hoursString);
  const minutes = Number(minutesString);
  return hours * 60 + minutes;
};

/**
 * Returns whether the start time is strictly after the end time.
 */
export const isBookingHourRangeOrderInvalid = (
  hour: string,
  hourSecond: string,
): boolean =>
  parseHourRangeTimeToMinutes(hour) > parseHourRangeTimeToMinutes(hourSecond);
