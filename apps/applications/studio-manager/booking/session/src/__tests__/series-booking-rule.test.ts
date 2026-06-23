import { describe, expect, it } from "vitest";

import { getSeriesBookingRule } from "#src/utils/series-booking-rule";

describe("series-booking-rule", () => {
  describe("getSeriesBookingRule", () => {
    it("returns fullSeries for full booking before start only", () => {
      expect(
        getSeriesBookingRule({
          full_booking_only: true,
          allow_booking_after_start: false,
        }),
      ).toBe("fullSeries");
    });

    it("returns openSeries for full booking after start", () => {
      expect(
        getSeriesBookingRule({
          full_booking_only: true,
          allow_booking_after_start: true,
        }),
      ).toBe("openSeries");
    });

    it("returns singleClass when full booking is disabled", () => {
      expect(
        getSeriesBookingRule({
          full_booking_only: false,
          allow_booking_after_start: true,
        }),
      ).toBe("singleClass");
    });
  });
});
