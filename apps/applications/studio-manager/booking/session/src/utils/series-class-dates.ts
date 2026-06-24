import { fromIsoString } from "@bsport/datetime-manipulation";

type SeriesClassDateStart = {
  date_start: string;
};

export const sortSeriesClassesByDateStart = <T extends SeriesClassDateStart>(
  classes: T[],
): T[] =>
  [...classes].sort(
    (firstClass, secondClass) =>
      fromIsoString(firstClass.date_start).toMillis() -
      fromIsoString(secondClass.date_start).toMillis(),
  );
