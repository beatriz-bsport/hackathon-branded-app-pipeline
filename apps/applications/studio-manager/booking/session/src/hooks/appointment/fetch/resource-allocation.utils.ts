import type { EnrichedAppointment } from "#src/types";

/**
 * Merges overlapping/adjacent intervals. Matches saas-legacy joinIntervalList.
 */
export const mergeIntervals = (intervals: string[][]): string[][] => {
  if (intervals.length < 2) return intervals;

  const sorted = [...intervals].sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
  );

  const merged: string[][] = [[...sorted[0]]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = sorted[i];
    if (new Date(curr[0]).getTime() <= new Date(prev[1]).getTime()) {
      prev[1] =
        new Date(prev[1]).getTime() > new Date(curr[1]).getTime()
          ? prev[1]
          : curr[1];
    } else {
      merged.push([...curr]);
    }
  }
  return merged;
};

/**
 * Checks if the proposed time does NOT fit within any available interval.
 * Returns true if unavailable, false if available.
 *
 * When rescheduling, the appointment's own slot is added as available
 * (since we're moving away from it). Matches saas-legacy behavior.
 */
export const isResourceUnavailable = (
  intervals: string[][],
  dateStart: string,
  durationMinutes: number,
  currentSlot?: { dateStart: string; dateEnd: string },
): boolean => {
  const filtered = intervals.filter(
    (interval) => !!interval[0] && !!interval[1],
  );

  const allIntervals = currentSlot
    ? filtered.concat([[currentSlot.dateStart, currentSlot.dateEnd]])
    : filtered;

  const merged = mergeIntervals(allIntervals);

  const proposedStart = new Date(dateStart).getTime();
  const proposedEnd = proposedStart + durationMinutes * 60 * 1000;

  return !merged.some((interval) => {
    const slotStart = new Date(interval[0]).getTime();
    const slotEnd = new Date(interval[1]).getTime();
    return proposedStart >= slotStart && proposedEnd <= slotEnd;
  });
};

export const getDurationMinutes = (
  appointment: EnrichedAppointment,
): number => {
  const start = new Date(appointment.date_start).getTime();
  const end = new Date(appointment.date_end).getTime();
  return (end - start) / (60 * 1000);
};
