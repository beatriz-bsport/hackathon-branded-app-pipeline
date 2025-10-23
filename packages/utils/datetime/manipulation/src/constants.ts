import { DateTime as LuxonDateTime, Duration as LuxonDuration } from "luxon";

export { LuxonDateTime };

/**
 * Our custom DateTime type that currently uses Luxon under the hood.
 * If we change libraries in the future, we only need to update this type.
 */
export type DateTime = LuxonDateTime;

/**
 * Our custom Duration type that currently uses Luxon under the hood.
 * If we change libraries in the future, we only need to update this type.
 */
export type Duration = LuxonDuration;

export type DurationLike = {
  year?: number;
  quarter?: number;
  month?: number;
  week?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
};

export type Unit =
  | "years"
  | "months"
  | "days"
  | "hours"
  | "minutes"
  | "milliseconds";
