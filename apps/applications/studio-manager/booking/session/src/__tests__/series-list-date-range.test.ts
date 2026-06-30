import { describe, expect, it } from "vitest";

import { fromIsoString } from "@bsport/datetime-manipulation";

import { getSeriesListDateRange } from "#src/components/series-list/series-list-date-range";

describe("getSeriesListDateRange", () => {
  const today = fromIsoString("2026-06-26T00:00:00");

  it("maps single-date selection to a one-day date range", () => {
    const selectedDay = fromIsoString("2026-06-23T00:00:00");

    expect(
      getSeriesListDateRange({
        selectedDate: { type: "single", date: selectedDay },
        today,
      }),
    ).toEqual([selectedDay, selectedDay]);
  });

  it("keeps complete range selection bounds", () => {
    const minDate = fromIsoString("2026-06-23T00:00:00");
    const maxDate = fromIsoString("2026-06-30T00:00:00");

    expect(
      getSeriesListDateRange({
        selectedDate: { type: "range", minDate, maxDate },
        today,
      }),
    ).toEqual([minDate, maxDate]);
  });

  it("keeps open-ended persisted range selection", () => {
    const minDate = fromIsoString("2026-06-23T00:00:00");

    expect(
      getSeriesListDateRange({
        selectedDate: { type: "range", minDate, maxDate: null },
        today,
      }),
    ).toEqual([minDate, null]);
  });
});
