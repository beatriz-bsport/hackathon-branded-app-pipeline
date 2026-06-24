import { describe, expect, it } from "vitest";

import {
  buildSeriesDetailsPayload,
  getSeriesDetailsInitialValues,
} from "#src/utils/series-details-form";

describe("series-editor-form", () => {
  describe("getSeriesDetailsInitialValues", () => {
    it("uses group fields and first chronological class tags", () => {
      expect(
        getSeriesDetailsInitialValues({
          series: {
            allow_booking_after_start: true,
            full_booking_only: true,
            level: 3,
            manager_only: true,
            name: "Summer series",
          },
          classes: [
            {
              blacklist_tags: [30],
              date_start: "2026-07-01T09:00:00+02:00",
              whitelist_tags: [10],
            },
            {
              blacklist_tags: [40],
              date_start: "2026-06-01T09:00:00+02:00",
              whitelist_tags: [20],
            },
          ],
        }),
      ).toEqual({
        blacklist_tags: [40],
        bookingRule: "openSeries",
        level: 3,
        manager_only: true,
        name: "Summer series",
        whitelist_tags: [20],
      });
    });

    it("uses timestamps when class date offsets differ", () => {
      expect(
        getSeriesDetailsInitialValues({
          series: {
            allow_booking_after_start: false,
            full_booking_only: true,
            level: 3,
            manager_only: false,
            name: "Offset series",
          },
          classes: [
            {
              blacklist_tags: [30],
              date_start: "2026-01-01T09:30:00+00:00",
              whitelist_tags: [10],
            },
            {
              blacklist_tags: [40],
              date_start: "2026-01-01T10:00:00+02:00",
              whitelist_tags: [20],
            },
          ],
        }),
      ).toMatchObject({
        blacklist_tags: [40],
        whitelist_tags: [20],
      });
    });
  });

  describe("buildSeriesDetailsPayload", () => {
    it("maps full series to full booking before start only", () => {
      expect(
        buildSeriesDetailsPayload({
          blacklist_tags: [],
          bookingRule: "fullSeries",
          level: 1,
          manager_only: false,
          name: "Updated series",
          whitelist_tags: [],
        }),
      ).toMatchObject({
        allow_booking_after_start: false,
        full_booking_only: true,
      });
    });

    it("maps open series to full booking after start", () => {
      expect(
        buildSeriesDetailsPayload({
          blacklist_tags: [],
          bookingRule: "openSeries",
          level: 1,
          manager_only: false,
          name: "Updated series",
          whitelist_tags: [],
        }),
      ).toMatchObject({
        allow_booking_after_start: true,
        full_booking_only: true,
      });
    });

    it("builds the supported grouped-offer update payload only", () => {
      const payload = buildSeriesDetailsPayload({
        blacklist_tags: [2],
        bookingRule: "singleClass",
        level: 1,
        manager_only: false,
        name: "Updated series",
        whitelist_tags: [1],
      });

      expect(payload).toEqual({
        allow_booking_after_start: true,
        blacklist_tags: [2],
        full_booking_only: false,
        level: 1,
        manager_only: false,
        name: "Updated series",
        whitelist_tags: [1],
      });
      expect(payload).not.toHaveProperty("available");
      expect(payload).not.toHaveProperty("meta_activity");
    });
  });
});
