import type { DateTime } from "@bsport/datetime-manipulation";

import type { DateSelection } from "#src/types";

export type SeriesListDateRange = [DateTime, DateTime | null];

type GetSeriesListDateRangeParams = {
  selectedDate: DateSelection;
  today: DateTime;
};

export const getSeriesListDateRange = ({
  selectedDate,
  today,
}: GetSeriesListDateRangeParams): SeriesListDateRange => {
  if (selectedDate.type === "single") {
    return [selectedDate.date, selectedDate.date];
  }

  const fromDate = selectedDate.minDate ?? today;

  return [fromDate, selectedDate.maxDate ?? null];
};
