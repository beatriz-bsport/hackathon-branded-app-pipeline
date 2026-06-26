import { describe, expect, it } from "vitest";

import {
  getSeriesClassStatusCounts,
  getSeriesNonCancelledClassBounds,
  isSeriesCancelled,
} from "#src/utils/series-detail-drawer";

const NOW = new Date("2026-06-09T10:00:00.000Z");

describe("series-detail-drawer helpers", () => {
  describe("getSeriesNonCancelledClassBounds", () => {
    it("returns first and last dates from ordered non-cancelled classes only", () => {
      expect(
        getSeriesNonCancelledClassBounds([
          {
            available: false,
            date_start: "2026-06-01T07:00:00+02:00",
          },
          {
            available: true,
            date_start: "2026-06-09T07:00:00+02:00",
          },
          {
            available: true,
            date_start: "2026-06-16T07:00:00+02:00",
          },
        ]),
      ).toEqual({
        firstClassDate: "2026-06-09T07:00:00+02:00",
        lastClassDate: "2026-06-16T07:00:00+02:00",
      });
    });

    it("returns chronological bounds from unordered non-cancelled classes", () => {
      expect(
        getSeriesNonCancelledClassBounds([
          {
            available: true,
            date_start: "2026-06-16T07:00:00+02:00",
          },
          {
            available: false,
            date_start: "2026-06-01T07:00:00+02:00",
          },
          {
            available: true,
            date_start: "2026-06-09T07:00:00+02:00",
          },
        ]),
      ).toEqual({
        firstClassDate: "2026-06-09T07:00:00+02:00",
        lastClassDate: "2026-06-16T07:00:00+02:00",
      });
    });

    it("returns boundary class time zones when available", () => {
      expect(
        getSeriesNonCancelledClassBounds([
          {
            available: true,
            date_start: "2026-06-23T23:30:00-07:00",
            timezone_name: "America/Los_Angeles",
          },
          {
            available: true,
            date_start: "2026-06-30T08:00:00+09:00",
            timezone_name: "Asia/Tokyo",
          },
        ]),
      ).toEqual({
        firstClassDate: "2026-06-23T23:30:00-07:00",
        firstClassTimeZone: "America/Los_Angeles",
        lastClassDate: "2026-06-30T08:00:00+09:00",
        lastClassTimeZone: "Asia/Tokyo",
      });
    });

    it("returns empty bounds when every class is cancelled", () => {
      expect(
        getSeriesNonCancelledClassBounds([
          {
            available: false,
            date_start: "2026-06-01T07:00:00+02:00",
          },
        ]),
      ).toEqual({
        firstClassDate: null,
        lastClassDate: null,
      });
    });
  });

  describe("getSeriesClassStatusCounts", () => {
    it("counts upcoming, ongoing, past, and cancelled classes", () => {
      expect(
        getSeriesClassStatusCounts(
          [
            {
              available: true,
              date_start: "2026-06-09T13:00:00+02:00",
              duration_minute: 60,
              timezone_name: "Europe/Paris",
            },
            {
              available: true,
              date_start: "2026-06-09T11:30:00+02:00",
              duration_minute: 60,
              timezone_name: "Europe/Paris",
            },
            {
              available: true,
              date_start: "2026-06-09T08:00:00+02:00",
              duration_minute: 60,
              timezone_name: "Europe/Paris",
            },
            {
              available: false,
              date_start: "2026-06-09T13:00:00+02:00",
              duration_minute: 60,
              timezone_name: "Europe/Paris",
            },
          ],
          NOW,
        ),
      ).toEqual({
        cancelled: 1,
        ongoing: 1,
        past: 1,
        upcoming: 1,
      });
    });
  });

  describe("isSeriesCancelled", () => {
    it("returns true when the group is unavailable", () => {
      expect(
        isSeriesCancelled({
          classes: [{ available: true }],
          series: { available: false },
        }),
      ).toBe(true);
    });

    it("returns true when all classes are cancelled", () => {
      expect(
        isSeriesCancelled({
          classes: [{ available: false }, { available: false }],
          series: { available: true },
        }),
      ).toBe(true);
    });

    it("returns false when at least one class is available", () => {
      expect(
        isSeriesCancelled({
          classes: [{ available: false }, { available: true }],
          series: { available: true },
        }),
      ).toBe(false);
    });
  });
});
