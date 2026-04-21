import { type DateTime } from "@bsport/datetime-manipulation";

export const isInRange = (
  date: DateTime,
  minDate: DateTime | null,
  maxDate: DateTime | null,
) => {
  if (minDate && maxDate) {
    return date >= minDate && date <= maxDate;
  }
  return false;
};
