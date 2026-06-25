import { describe, expect, it } from "vitest";

import { DEFAULT_LEVEL_ID } from "#src/hooks/level/constants";
import {
  DEFAULT_SERIES_DETAILS_FORM_VALUES,
  buildSeriesDetailsFormSchema,
} from "#src/utils/series-details-form";

const seriesDetailsFormSchema = buildSeriesDetailsFormSchema({
  nameRequired: "Enter a series name.",
  tagsMutuallyExclusive: "A tag cannot be both allowed and not allowed.",
});

describe("series-details-form", () => {
  describe("DEFAULT_SERIES_DETAILS_FORM_VALUES", () => {
    it("uses the decided add-series defaults", () => {
      expect(DEFAULT_SERIES_DETAILS_FORM_VALUES).toEqual({
        blacklist_tags: [],
        bookingRule: "fullSeries",
        level: DEFAULT_LEVEL_ID,
        manager_only: false,
        name: "",
        whitelist_tags: [],
      });
    });
  });

  describe("seriesDetailsFormSchema", () => {
    it("accepts a valid details form", () => {
      expect(
        seriesDetailsFormSchema.safeParse({
          ...DEFAULT_SERIES_DETAILS_FORM_VALUES,
          name: "Summer yoga series",
        }).success,
      ).toBe(true);
    });

    it("rejects a blank series name", () => {
      const result = seriesDetailsFormSchema.safeParse({
        ...DEFAULT_SERIES_DETAILS_FORM_VALUES,
        name: "   ",
      });

      expect(result.success).toBe(false);

      if (result.success) {
        throw new Error("Expected blank series name to be invalid.");
      }

      expect(result.error.issues).toEqual([
        expect.objectContaining({
          message: "Enter a series name.",
          path: ["name"],
        }),
      ]);
    });

    it("rejects tags selected as both allowed and not allowed", () => {
      const result = seriesDetailsFormSchema.safeParse({
        ...DEFAULT_SERIES_DETAILS_FORM_VALUES,
        blacklist_tags: [2, 3],
        name: "Summer yoga series",
        whitelist_tags: [1, 2],
      });

      expect(result.success).toBe(false);

      if (result.success) {
        throw new Error("Expected duplicated tag rules to be invalid.");
      }

      expect(result.error.issues).toEqual([
        expect.objectContaining({
          message: "A tag cannot be both allowed and not allowed.",
          path: ["blacklist_tags"],
        }),
      ]);
    });
  });
});
