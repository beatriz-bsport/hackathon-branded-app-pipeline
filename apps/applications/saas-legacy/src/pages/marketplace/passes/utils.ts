import type {
  DailyTimeSlots,
  PassRestriction,
  PassRestrictionFrequency,
} from '#src/pages/marketplace/passes/types';

/**
 * Extracts and normalizes daily time slots from a payment pack's off-peak schedule.
 *
 * The function reads the `off_peak_schedule` from the provided `pack`, validates
 * the structure, and returns a list of objects each representing valid time slots
 * for a day of the week.
 *
 * - Days are represented by keys from '1' to '7' (1 = Monday, 7 = Sunday).
 * - Time slots for each day should be arrays of tuples in the form `[from, to]` with time strings.
 *
 * @param {Record<string, string[][]>} schedule - The off-peak schedule.
 * @returns {DailyTimeSlots[]} An array of objects where each includes:
 *   - `dayOfWeek`: number (0 for Monday, 6 for Sunday)
 *   - `slots`: array of `{ from: string; to: string }` representing valid time slots
 */
export const getDailyTimeSlots = (
  schedule: Record<string, string[][]>,
): DailyTimeSlots[] => {
  if (!schedule) return [];

  return Object.entries(schedule)
    .map(([key, timeSlotsForDay]) => {
      const dayKeyNumber = parseInt(key);
      if (isNaN(dayKeyNumber)) return null;

      // Convert 1-based key to 0-based index since the schedule is 1-based
      // and the datetime translations are 0-based
      const dayIndex = dayKeyNumber - 1;

      // Map and create the time slots objects
      const timeSlots = timeSlotsForDay.map((slotTuple) => ({
        from: slotTuple[0],
        to: slotTuple[1],
      }));

      return timeSlots.length > 0
        ? { dayOfWeek: dayIndex, slots: timeSlots }
        : null;
    })
    .filter((dailyTimeSlot) => !!dailyTimeSlot)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek);
};

/**
 * Generates an array of pack restrictions based on provided booking limits.
 *
 * @param {object} limits - An object containing the booking limits.
 * @param {number | null} limits.maxBookingPerDay - Maximum bookings allowed per day.
 * @param {number | null} limits.maxBookingPerWeek - Maximum bookings allowed per week.
 * @param {number | null} limits.maxBookingPerMonth - Maximum bookings allowed per month.
 * @returns {PassRestriction[]} An array of `PassRestriction` objects.
 */
export const getPackRestrictions = ({
  maxBookingPerDay,
  maxBookingPerWeek,
  maxBookingPerMonth,
}: {
  maxBookingPerDay: number | null;
  maxBookingPerWeek: number | null;
  maxBookingPerMonth: number | null;
}): PassRestriction[] => {
  const entries: [PassRestrictionFrequency, number | null][] = [
    ['daily', maxBookingPerDay],
    ['weekly', maxBookingPerWeek],
    ['monthly', maxBookingPerMonth],
  ];

  return entries
    .filter(([, amount]) => amount !== null)
    .map(([frequency, amount]) => ({ frequency, amount: amount! }));
};
