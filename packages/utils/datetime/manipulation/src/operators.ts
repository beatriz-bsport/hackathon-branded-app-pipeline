import type { DateTime, Duration, Unit } from "./constants";

/**
 * Compute the time difference between two datetimes.
 * @param param.upperDatetime
 * @param param.lowerDatetime
 * @param param.units The unit or array of units to include in the duration. Defaults to ['milliseconds'].
 * @returns A Duration representing the difference, that can be converted into an object.
 *
 * @example
 * const i1 = DateTime.fromISO('1982-05-25T09:45');
 * const i2 = DateTime.fromISO('1983-10-14T10:30');
 * const diff = calculateDiffDuration({
 *  upperDatetime: i2,
 *  lowerDatetime: i1,
 *  units: ['months', 'days', 'hours']
 * });
 * const { months, days, hours } = diff.toObject();
 */
export const calculateDiffDuration = ({
  upperDatetime,
  lowerDatetime,
  units = ["milliseconds"],
}: {
  upperDatetime: DateTime;
  lowerDatetime: DateTime;
  units?: Unit | Array<Unit>;
}): Duration => {
  return upperDatetime.diff(lowerDatetime, units);
};
