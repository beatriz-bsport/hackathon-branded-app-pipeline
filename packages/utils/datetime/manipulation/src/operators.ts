import type { DateTime, Duration, DurationLike, Unit } from "./constants";

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

/**
 * Allow to add (operator = "plus") or remove (operator = "minus") time to a datetime object.
 *
 * Adding hours, minutes, seconds, or milliseconds increases the timestamp by the right number of milliseconds. Adding days, months, or years shifts the calendar,
 * accounting for DSTs and leap years along the way. Thus, `dt.plus({ hours: 24 })` may result in a different time than `dt.plus({ days: 1 })` if there's a DST shift in between.
 *
 * @param duration - The amount to add or remove.
 *
 * @example
 * modifyTime({ datetime: DateTime.now(), duration: { minutes: 15 }, operator: "plus" }) //~> in 15 minutes
 * @example
 * modifyTime({ datetime: DateTime.now(), duration: { days: 1 }, operator: "plus" }) //~> this time tomorrow
 * @example
 * modifyTime({ datetime: DateTime.now(), duration: { days: 1 }, operator: "minus" }) //~> this time yesterday
 * @example
 * modifyTime({ datetime: DateTime.now(), duration: { hours: 3, minutes: 13 }, operator: "plus" }) //~> in 3 hr, 13 min
 */
export const modifyTime = ({
  datetime,
  duration,
  operator,
}: {
  datetime: DateTime;
  duration: DurationLike;
  operator: "plus" | "minus";
}): DateTime => {
  if (operator !== "plus" && operator !== "minus") {
    throw new Error(
      `Invalid operator: ${operator}. Expected "plus" or "minus".`,
    );
  }

  return operator === "plus"
    ? datetime.plus(duration)
    : datetime.minus(duration);
};
