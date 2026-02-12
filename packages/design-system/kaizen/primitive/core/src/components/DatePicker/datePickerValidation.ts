import type { DateTime } from "@bsport/datetime-manipulation";

/**
 * Selected date value: either a single date, a range tuple, or null.
 */
export type SelectedDate = DateTime | [DateTime | null, DateTime | null] | null;

/**
 * Sanitizes a date value to match the current picker mode.
 * Use this when embedding the DatePicker content in a custom context
 * to ensure values are valid (e.g. range mode always receives [start, end]).
 *
 * @param mode - "single" | "range"
 * @param value - Current selected value (may be unsanitized)
 * @returns Value normalized for the mode: single returns as-is, range returns [null, null] if not an array
 */
export function getSanitizedDate(
  mode: "single" | "range",
  value: SelectedDate,
): SelectedDate {
  if (mode === "single") {
    return value;
  }
  return Array.isArray(value) ? value : [null, null];
}
