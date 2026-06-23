import { describe, expect, it } from "vitest";

import { getSeriesDateBounds } from "#src/components/series-list/series-list-helpers";

describe("series-list-helpers", () => {
  describe("getSeriesDateBounds", () => {
    it("returns first date without last_offer_date", () => {
      expect(
        getSeriesDateBounds({
          first_offer_date: "2026-04-28",
          last_offer_date: null,
        }),
      ).toEqual({
        firstDate: "2026-04-28",
        lastDate: null,
      });
    });

    it("returns date range bounds with last_offer_date", () => {
      expect(
        getSeriesDateBounds({
          first_offer_date: "2026-04-28",
          last_offer_date: "2026-06-11",
        }),
      ).toEqual({
        firstDate: "2026-04-28",
        lastDate: "2026-06-11",
      });
    });
  });
});
