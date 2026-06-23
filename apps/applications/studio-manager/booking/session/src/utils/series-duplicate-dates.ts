import {
  type DateTime,
  fromIsoString,
  getDaysUntil,
  modifyTime,
} from "@bsport/datetime-manipulation";

type GetSeriesDuplicateDayDeltaParams = {
  originalFirstClassDateStart: string;
  startDate: DateTime;
  timeZone: string;
};

export const getSeriesDuplicateDayDelta = ({
  originalFirstClassDateStart,
  startDate,
  timeZone,
}: GetSeriesDuplicateDayDeltaParams) => {
  const originalFirstClassDate = fromIsoString(originalFirstClassDateStart, {
    zone: timeZone,
  });
  const shiftedFirstClassDate = startDate.setZone(timeZone);

  return getDaysUntil(shiftedFirstClassDate, originalFirstClassDate);
};

export const getShiftedSeriesDuplicateClassDate = ({
  dateStart,
  dayDelta,
  timeZone,
}: {
  dateStart: string;
  dayDelta: number;
  timeZone: string;
}) =>
  modifyTime({
    datetime: fromIsoString(dateStart, { zone: timeZone }),
    duration: { day: Math.abs(dayDelta) },
    operator: dayDelta >= 0 ? "plus" : "minus",
  });
