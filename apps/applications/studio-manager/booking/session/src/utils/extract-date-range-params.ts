import { type DateTime, getIsoDate } from "@bsport/datetime-manipulation";

export const extractDateRangeParams = (
  params: { date: DateTime } | { minDate: DateTime; maxDate: DateTime } | null,
): { minDateKey: string | null; maxDateKey: string | null } => {
  if (!params) return { minDateKey: null, maxDateKey: null };

  if ("date" in params) {
    return {
      minDateKey: getIsoDate(params.date),
      maxDateKey: getIsoDate(params.date),
    };
  }

  return {
    minDateKey: getIsoDate(params.minDate),
    maxDateKey: getIsoDate(params.maxDate),
  };
};
