import type { Session } from "@bsport/api-book";

import {
  type SessionTimeStatus,
  getSessionTimeStatus,
} from "#src/components/session-occurrence-table/get-session-time-status";
import type { Series } from "#src/types";
import { sortSeriesClassesByDateStart } from "#src/utils/series-class-dates";

// Drawer helpers intentionally accept the smallest class shape they need.
// The all-classes query returns full Session objects, while tests and derived
// rows can pass only these fields without coupling helpers to the full payload.
type SeriesClassDateBoundsInput = Pick<Session, "available" | "date_start"> &
  Partial<Pick<Session, "timezone_name">>;

type SeriesClassStatusInput = Pick<
  Session,
  "available" | "date_start" | "duration_minute" | "timezone_name"
>;

export type SeriesClassDateBounds = {
  firstClassDate: string | null;
  firstClassTimeZone?: string;
  lastClassDate: string | null;
  lastClassTimeZone?: string;
};

export type SeriesClassStatusCounts = Record<SessionTimeStatus, number>;

const EMPTY_STATUS_COUNTS: SeriesClassStatusCounts = {
  cancelled: 0,
  ongoing: 0,
  past: 0,
  upcoming: 0,
};

export const getSeriesNonCancelledClassBounds = (
  classes: SeriesClassDateBoundsInput[],
): SeriesClassDateBounds => {
  const availableClasses = classes.filter(
    (sessionClass) => sessionClass.available,
  );
  const sortedAvailableClasses = sortSeriesClassesByDateStart(availableClasses);
  const firstClass = sortedAvailableClasses[0];
  const lastClass = sortedAvailableClasses[sortedAvailableClasses.length - 1];

  return {
    firstClassDate: firstClass?.date_start ?? null,
    ...(firstClass?.timezone_name
      ? { firstClassTimeZone: firstClass.timezone_name }
      : {}),
    lastClassDate: lastClass?.date_start ?? null,
    ...(lastClass?.timezone_name
      ? { lastClassTimeZone: lastClass.timezone_name }
      : {}),
  };
};

export const getSeriesClassStatusCounts = (
  classes: SeriesClassStatusInput[],
  now = new Date(),
): SeriesClassStatusCounts =>
  classes.reduce<SeriesClassStatusCounts>(
    (counts, sessionClass) => {
      const status = getSessionTimeStatus({
        dateStart: sessionClass.date_start,
        durationMinute: sessionClass.duration_minute,
        available: sessionClass.available,
        timeZone: sessionClass.timezone_name,
        now,
      });

      return {
        ...counts,
        [status]: counts[status] + 1,
      };
    },
    { ...EMPTY_STATUS_COUNTS },
  );

export const isSeriesCancelled = ({
  classes,
  series,
}: {
  classes: Pick<Session, "available">[];
  series: Pick<Series, "available">;
}): boolean => {
  if (!series.available) {
    return true;
  }

  return (
    classes.length > 0 &&
    classes.every((sessionClass) => !sessionClass.available)
  );
};
