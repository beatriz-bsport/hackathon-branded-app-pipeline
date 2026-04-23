import { describe, expect, it } from "vitest";

import {
  getDurationMinutes,
  isResourceUnavailable,
  mergeIntervals,
} from "#src/hooks/appointment/fetch/resource-allocation.utils";
import type { EnrichedAppointment } from "#src/types";

// All tests use 2025-01-01 as the base date. `at("09:30")` → "2025-01-01T09:30:00Z".
const at = (time: string): string => `2025-01-01T${time}:00Z`;

describe("mergeIntervals", () => {
  it("returns empty array unchanged", () => {
    expect(mergeIntervals([])).toEqual([]);
  });

  it("returns single interval unchanged", () => {
    const intervals = [[at("09:00"), at("10:00")]];
    expect(mergeIntervals(intervals)).toEqual(intervals);
  });

  it("leaves non-overlapping intervals separate", () => {
    const intervals = [
      [at("09:00"), at("10:00")],
      [at("11:00"), at("12:00")],
    ];
    expect(mergeIntervals(intervals)).toEqual(intervals);
  });

  it("merges adjacent intervals that touch at the boundary", () => {
    const intervals = [
      [at("09:00"), at("10:00")],
      [at("10:00"), at("11:00")],
    ];
    expect(mergeIntervals(intervals)).toEqual([[at("09:00"), at("11:00")]]);
  });

  it("merges overlapping intervals", () => {
    const intervals = [
      [at("09:00"), at("10:30")],
      [at("10:00"), at("11:00")],
    ];
    expect(mergeIntervals(intervals)).toEqual([[at("09:00"), at("11:00")]]);
  });

  it("absorbs a fully contained interval into the larger one", () => {
    const intervals = [
      [at("09:00"), at("12:00")],
      [at("10:00"), at("11:00")],
    ];
    expect(mergeIntervals(intervals)).toEqual([[at("09:00"), at("12:00")]]);
  });

  it("sorts unsorted input before merging", () => {
    const intervals = [
      [at("11:00"), at("12:00")],
      [at("09:00"), at("10:00")],
    ];
    expect(mergeIntervals(intervals)).toEqual([
      [at("09:00"), at("10:00")],
      [at("11:00"), at("12:00")],
    ]);
  });

  it("chains multiple overlapping intervals into one", () => {
    const intervals = [
      [at("09:00"), at("10:30")],
      [at("10:00"), at("11:30")],
      [at("11:00"), at("12:30")],
    ];
    expect(mergeIntervals(intervals)).toEqual([[at("09:00"), at("12:30")]]);
  });

  it("does not mutate the input intervals", () => {
    const intervals = [
      [at("09:00"), at("10:30")],
      [at("10:00"), at("11:30")],
    ];
    const snapshot = intervals.map((interval) => [...interval]);

    mergeIntervals(intervals);

    expect(intervals).toEqual(snapshot);
  });
});

describe("isResourceUnavailable", () => {
  it("returns false when the proposed slot fits inside an interval", () => {
    const intervals = [[at("09:00"), at("12:00")]];
    const result = isResourceUnavailable(intervals, at("10:00"), 60);
    expect(result).toBe(false);
  });

  it("returns true when the proposed slot extends past the interval end", () => {
    const intervals = [[at("09:00"), at("10:30")]];
    const result = isResourceUnavailable(intervals, at("10:00"), 60);
    expect(result).toBe(true);
  });

  it("returns true when the proposed slot starts before the interval start", () => {
    const intervals = [[at("11:00"), at("13:00")]];
    const result = isResourceUnavailable(intervals, at("10:00"), 60);
    expect(result).toBe(true);
  });

  it("returns true when the proposed slot falls entirely outside all intervals", () => {
    const intervals = [
      [at("09:00"), at("10:00")],
      [at("14:00"), at("15:00")],
    ];
    const result = isResourceUnavailable(intervals, at("12:00"), 60);
    expect(result).toBe(true);
  });

  it("returns true when intervals array is empty", () => {
    expect(isResourceUnavailable([], at("10:00"), 60)).toBe(true);
  });

  it("filters out intervals with nullish start or end", () => {
    const intervals = [
      ["", at("10:00")],
      [at("11:00"), ""],
      [at("09:00"), at("12:00")],
    ];
    const result = isResourceUnavailable(intervals, at("10:00"), 60);
    expect(result).toBe(false);
  });

  it("returns false when the proposed slot exactly matches an interval", () => {
    const intervals = [[at("10:00"), at("11:00")]];
    const result = isResourceUnavailable(intervals, at("10:00"), 60);
    expect(result).toBe(false);
  });

  it("treats currentSlot as available, bridging two adjacent intervals", () => {
    const intervals = [
      [at("09:00"), at("10:00")],
      [at("11:00"), at("12:00")],
    ];
    const currentSlot = { dateStart: at("10:00"), dateEnd: at("11:00") };
    const result = isResourceUnavailable(
      intervals,
      at("09:30"),
      120,
      currentSlot,
    );
    expect(result).toBe(false);
  });

  it("without currentSlot, the same gap between intervals is unavailable", () => {
    const intervals = [
      [at("09:00"), at("10:00")],
      [at("11:00"), at("12:00")],
    ];
    const result = isResourceUnavailable(intervals, at("09:30"), 120);
    expect(result).toBe(true);
  });

  it("treats currentSlot before all intervals as an earlier available window", () => {
    const intervals = [[at("11:00"), at("12:00")]];
    const currentSlot = { dateStart: at("08:00"), dateEnd: at("09:00") };
    const result = isResourceUnavailable(
      intervals,
      at("08:00"),
      60,
      currentSlot,
    );
    expect(result).toBe(false);
  });

  it("treats currentSlot after all intervals as a later available window", () => {
    const intervals = [[at("09:00"), at("10:00")]];
    const currentSlot = { dateStart: at("14:00"), dateEnd: at("15:00") };
    const result = isResourceUnavailable(
      intervals,
      at("14:00"),
      60,
      currentSlot,
    );
    expect(result).toBe(false);
  });
});

describe("getDurationMinutes", () => {
  const makeAppointment = (
    date_start: string,
    date_end: string,
  ): EnrichedAppointment =>
    ({
      date_start,
      date_end,
    }) as EnrichedAppointment;

  it("returns 60 for a 1-hour appointment", () => {
    const appointment = makeAppointment(at("09:00"), at("10:00"));
    expect(getDurationMinutes(appointment)).toBe(60);
  });

  it("returns 30 for a 30-minute appointment", () => {
    const appointment = makeAppointment(at("09:00"), at("09:30"));
    expect(getDurationMinutes(appointment)).toBe(30);
  });

  it("handles appointments crossing midnight", () => {
    const appointment = makeAppointment(
      "2025-01-01T23:30:00Z",
      "2025-01-02T00:30:00Z",
    );
    expect(getDurationMinutes(appointment)).toBe(60);
  });

  it("supports sub-minute precision", () => {
    const appointment = makeAppointment(
      "2025-01-01T09:00:00Z",
      "2025-01-01T09:00:30Z",
    );
    expect(getDurationMinutes(appointment)).toBe(0.5);
  });
});
