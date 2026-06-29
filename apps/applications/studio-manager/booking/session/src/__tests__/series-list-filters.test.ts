import { describe, expect, it } from "vitest";

import type { FilterElementState } from "@bsport/kaizen-primitive-core";

import {
  getSeriesAvailableParamFromFilters,
  getSeriesParamsFromFilters,
  hasActiveSeriesFilters,
} from "#src/components/series-list/filters/get-params-from-filters";
import {
  SeriesFilterField,
  SeriesFilterOperator,
} from "#src/components/series-list/filters/types";

const createFilter = (
  field: SeriesFilterField | null,
  valueIds: string[],
): FilterElementState => ({
  id: 1,
  field,
  filter: field ? SeriesFilterOperator.FILTER_IS : null,
  valueIds,
});

describe("series-list-filters", () => {
  it("maps service filters to meta activity identifiers", () => {
    expect(
      getSeriesParamsFromFilters([
        createFilter(SeriesFilterField.SERVICE, ["12", "18"]),
      ]),
    ).toEqual({
      meta_activity__in: [12, 18],
    });
  });

  it("maps status filters to backend status values", () => {
    expect(
      getSeriesParamsFromFilters([
        createFilter(SeriesFilterField.STATUS, ["scheduled"]),
      ]),
    ).toEqual({
      status: "scheduled",
    });
  });

  it("maps full series booking rule to backend booleans", () => {
    expect(
      getSeriesParamsFromFilters([
        createFilter(SeriesFilterField.BOOKING_RULE, ["fullSeries"]),
      ]),
    ).toEqual({
      allow_booking_after_start: false,
      full_booking_only: true,
    });
  });

  it("maps open series booking rule to backend booleans", () => {
    expect(
      getSeriesParamsFromFilters([
        createFilter(SeriesFilterField.BOOKING_RULE, ["openSeries"]),
      ]),
    ).toEqual({
      allow_booking_after_start: true,
      full_booking_only: true,
    });
  });

  it("maps single class booking rule to full booking only", () => {
    expect(
      getSeriesParamsFromFilters([
        createFilter(SeriesFilterField.BOOKING_RULE, ["singleClass"]),
      ]),
    ).toEqual({
      full_booking_only: false,
    });
  });

  it("maps full and open series booking rules to full booking only", () => {
    expect(
      getSeriesParamsFromFilters([
        createFilter(SeriesFilterField.BOOKING_RULE, [
          "openSeries",
          "fullSeries",
        ]),
      ]),
    ).toEqual({
      full_booking_only: true,
    });
  });

  it("maps open series and single class booking rules to booking after start", () => {
    expect(
      getSeriesParamsFromFilters([
        createFilter(SeriesFilterField.BOOKING_RULE, [
          "openSeries",
          "singleClass",
        ]),
      ]),
    ).toEqual({
      allow_booking_after_start: true,
    });
  });

  it("omits booking rule params when every booking rule is selected", () => {
    expect(
      getSeriesParamsFromFilters([
        createFilter(SeriesFilterField.BOOKING_RULE, [
          "openSeries",
          "fullSeries",
          "singleClass",
        ]),
      ]),
    ).toEqual({});
  });

  it("omits booking rule params when selected booking rules cannot be expressed by backend booleans", () => {
    expect(
      getSeriesParamsFromFilters([
        createFilter(SeriesFilterField.BOOKING_RULE, [
          "fullSeries",
          "singleClass",
        ]),
      ]),
    ).toEqual({});
  });

  it("keeps active-only availability unless cancelled status is selected", () => {
    expect(
      getSeriesAvailableParamFromFilters(
        [createFilter(SeriesFilterField.STATUS, ["scheduled"])],
        true,
        true,
      ),
    ).toBe(true);

    expect(
      getSeriesAvailableParamFromFilters(
        [createFilter(SeriesFilterField.STATUS, ["cancelled"])],
        false,
        true,
      ),
    ).toBeUndefined();
  });

  it("omits active-only availability when cancelled series are shown", () => {
    expect(getSeriesAvailableParamFromFilters([], true, true)).toBeUndefined();
    expect(getSeriesAvailableParamFromFilters([], false, true)).toBe(true);
  });

  it("does not map cancelled status when cancelled series cannot be shown", () => {
    const cancelledStatusFilter = createFilter(SeriesFilterField.STATUS, [
      "cancelled",
    ]);

    expect(
      getSeriesParamsFromFilters([cancelledStatusFilter], {
        canShowCancelled: false,
      }),
    ).toEqual({});
    expect(
      getSeriesAvailableParamFromFilters(
        [cancelledStatusFilter],
        false,
        true,
        false,
      ),
    ).toBe(true);
  });

  it("ignores incomplete filters", () => {
    expect(hasActiveSeriesFilters([createFilter(null, [])])).toBe(false);
    expect(getSeriesParamsFromFilters([createFilter(null, [])])).toEqual({});
  });
});
