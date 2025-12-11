/**
 * Converts total minutes to separate days, hours, and minutes.
 *
 * @param totalMinutes - The total duration in minutes.
 * @returns An object with days, hours, and minutes.
 */
export const convertMinutesToDuration = (
  totalMinutes: number,
): { days: number; hours: number; minutes: number } => {
  const days = Math.floor(totalMinutes / (24 * 60));
  const remainingAfterDays = totalMinutes % (24 * 60);
  const hours = Math.floor(remainingAfterDays / 60);
  const minutes = remainingAfterDays % 60;

  return { days, hours, minutes };
};

/**
 * Converts days, hours, and minutes to total minutes.
 *
 * @param days - Number of days (default: 0).
 * @param hours - Number of hours (default: 0).
 * @param minutes - Number of minutes (default: 0).
 * @returns The total duration in minutes.
 */
export const convertDurationToMinutes = (
  days: number = 0,
  hours: number = 0,
  minutes: number = 0,
): number => {
  return days * 24 * 60 + hours * 60 + minutes;
};
