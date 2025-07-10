import type {
  DailyTimeSlots,
  PassRestriction,
  PassRestrictionFrequency,
  CardContent,
  CardValidityInfo,
} from '#src/pages/marketplace/passes/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
} from '@bsport/common/lib/master-data/buyable-items';

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

/**
 * Maps an array of PaymentPack objects to an array of CardContent
 * for displaying Pass cards.
 *
 * @param props - An object containing the required properties.
 * @param props.packs - An array of PaymentPack objects.
 * @param props.handleDetailsClick - A factory function that takes a pack ID (number) and returns the onClickDetails handler function for that pack.
 * @param props.handleAddToCart - A factory function that takes a pack ID (number) and returns the onAddToCart handler function for that pack.
 * @returns An array of CardContent objects.
 */

export const createPassCardContent = ({
  packs,
  handleDetailsClick,
  handleAddToCart,
}: {
  packs: PaymentPack[];
  handleDetailsClick: (packId: number) => () => void;
  handleAddToCart: (
    packId: number,
    buyableItemIdentifier: number,
  ) => () => void;
}): CardContent[] => {
  return packs.map((pack): CardContent => {
    const validityInfo: CardValidityInfo = {
      dateRange: pack.validity_daterange,
      durationYears: pack.duration_years ?? 0,
      durationMonths: pack.duration_months ?? 0,
      durationDays: pack.duration_days ?? 0,
      startDateMethod: pack.start_date_method,
    };

    return {
      id: pack.id,
      title: pack.name,
      validityInfo: validityInfo,
      price: pack.price,
      credits: pack.credits ?? 0,
      tax: pack.tax,
      onClickDetails: handleDetailsClick(pack.id),
      onAddToCart: handleAddToCart(pack.id, BUYABLE_ITEM_PASS),
    };
  });
};

/**
 * Maps an array of PrivatePass objects to an array of CardContent
 * for displaying AppointmentPass cards.
 *
 * @param props - An object containing the required properties.
 * @param props.passes - An array of PrivatePass objects.
 * @param props.handleDetailsClick - A factory function that takes a pass ID (number) and returns the onClickDetails handler function for that pass.
 * @param props.handleAddToCart - A factory function that takes a pass ID (number) and returns the onAddToCart handler function for that pass.
 * @returns An array of CardContent objects.
 */
export const createAppointmentPassCardContent = ({
  passes,
  handleAppointmentDetailsClick,
  handleAddToCart,
}: {
  passes: PrivatePass[];
  handleAppointmentDetailsClick: (passId: number) => () => void;
  handleAddToCart: (
    passId: number,
    buyableItemIdentifier: number,
  ) => () => void;
}): CardContent[] => {
  return passes.map((pass): CardContent => {
    const validityInfo: CardValidityInfo = {
      durationYears: pass.duration_years ?? 0,
      durationMonths: pass.duration_months ?? 0,
      durationDays: pass.duration_days ?? 0,
      startDateMethod: pass.start_date_method,
    };

    return {
      id: pass.id,
      title: pass.name,
      validityInfo: validityInfo,
      price: pass.price,
      credits: pass.credits ?? 0,
      tax: pass.tax,
      onClickDetails: handleAppointmentDetailsClick(pass.id),
      onAddToCart: handleAddToCart(pass.id, BUYABLE_ITEM_PRIVATE_PASS),
    };
  });
};
