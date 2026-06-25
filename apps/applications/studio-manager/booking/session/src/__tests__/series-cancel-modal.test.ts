import { describe, expect, it } from "vitest";

import {
  formatSeriesCancelDateRange,
  getSeriesCancelClassCount,
  getSeriesCancelSubtitle,
} from "#src/utils/series-cancel-modal";

const TIME_ZONE = "Europe/Paris";
const LOCALE = "en";

const series = {
  name: "Summer series",
  offers: [1, 2, 3],
};

describe("series-cancel-modal", () => {
  it("uses loaded classes for the cancel class count", () => {
    expect(
      getSeriesCancelClassCount({
        classes: [
          { available: true, date_start: "2026-06-16T09:00:00+02:00" },
          { available: true, date_start: "2026-06-23T09:00:00+02:00" },
        ],
        series,
      }),
    ).toBe(2);
  });

  it("counts only loaded non-cancelled classes for the cancel class count", () => {
    expect(
      getSeriesCancelClassCount({
        classes: [
          { available: true, date_start: "2026-06-16T09:00:00+02:00" },
          { available: false, date_start: "2026-06-23T09:00:00+02:00" },
          { available: true, date_start: "2026-06-30T09:00:00+02:00" },
        ],
        series,
      }),
    ).toBe(2);
  });

  it("returns zero when loaded classes are already cancelled", () => {
    expect(
      getSeriesCancelClassCount({
        classes: [
          { available: false, date_start: "2026-06-16T09:00:00+02:00" },
          { available: false, date_start: "2026-06-23T09:00:00+02:00" },
        ],
        series,
      }),
    ).toBe(0);
  });

  it("falls back to group offers when classes are not loaded", () => {
    expect(
      getSeriesCancelClassCount({
        classes: [],
        series,
      }),
    ).toBe(3);
  });

  it("formats one-class date ranges as a single date", () => {
    expect(
      formatSeriesCancelDateRange({
        firstClassDate: "2026-06-16T09:00:00+02:00",
        lastClassDate: "2026-06-16T09:00:00+02:00",
        locale: LOCALE,
        timeZone: TIME_ZONE,
      }),
    ).toBe("Jun 16, 2026");
  });

  it("formats same-local-day class date ranges as a single date", () => {
    expect(
      formatSeriesCancelDateRange({
        firstClassDate: "2026-06-16T09:00:00+02:00",
        lastClassDate: "2026-06-16T18:00:00+02:00",
        locale: LOCALE,
        timeZone: TIME_ZONE,
      }),
    ).toBe("Jun 16, 2026");
  });

  it("formats subtitle with non-cancelled class date bounds", () => {
    expect(
      getSeriesCancelSubtitle({
        classes: [
          { available: true, date_start: "2026-06-16T09:00:00+02:00" },
          { available: false, date_start: "2026-06-23T09:00:00+02:00" },
          { available: true, date_start: "2026-06-30T09:00:00+02:00" },
        ],
        locale: LOCALE,
        series,
        timeZone: TIME_ZONE,
      }),
    ).toBe("Summer series · Jun 16, 2026 - Jun 30, 2026");
  });

  it("uses the series name as subtitle when no date bounds exist", () => {
    expect(
      getSeriesCancelSubtitle({
        classes: [
          { available: false, date_start: "2026-06-16T09:00:00+02:00" },
        ],
        locale: LOCALE,
        series,
        timeZone: TIME_ZONE,
      }),
    ).toBe("Summer series");
  });
});
