import { describe, expect, it } from "vitest";

import { getValidPage, getValidPageSize } from "#src/utils";

describe("getValidPage", () => {
  describe("valid page numbers", () => {
    it("should return the same page number when it's greater than 1", () => {
      expect(getValidPage(5)).toBe(5);
      expect(getValidPage(10)).toBe(10);
      expect(getValidPage(100)).toBe(100);
    });

    it("should return 1 for page number 1", () => {
      expect(getValidPage(1)).toBe(1);
    });
  });

  describe("invalid page numbers", () => {
    it("should return 1 for page numbers less than 1", () => {
      expect(getValidPage(0)).toBe(1);
      expect(getValidPage(-1)).toBe(1);
      expect(getValidPage(-10)).toBe(1);
    });

    it("should return 1 for decimal page numbers less than 1", () => {
      expect(getValidPage(0.5)).toBe(1);
      expect(getValidPage(-0.5)).toBe(1);
    });
  });

  describe("edge cases", () => {
    it("should handle decimal page numbers greater than 1", () => {
      expect(getValidPage(1.5)).toBe(2);
      expect(getValidPage(2.9)).toBe(3);
    });

    it("should handle very large numbers", () => {
      expect(getValidPage(999999)).toBe(999999);
    });

    it("should handle Infinity", () => {
      expect(getValidPage(Infinity)).toBe(Infinity);
    });

    it("should handle NaN", () => {
      expect(getValidPage(NaN)).toBe(1);
    });
  });
});

describe("getValidPageSize", () => {
  // Note: DEFAULT_ALLOWED_PAGE_SIZES = [10, 25, 50, 100]

  describe("exact matches", () => {
    it("should return the same page size when it matches allowed values", () => {
      expect(getValidPageSize(10)).toBe(10);
      expect(getValidPageSize(25)).toBe(25);
      expect(getValidPageSize(50)).toBe(50);
      expect(getValidPageSize(100)).toBe(100);
    });
  });

  describe("closest match selection", () => {
    it("should return closest allowed page size for values between allowed sizes", () => {
      // Closer to 10
      expect(getValidPageSize(12)).toBe(10);
      expect(getValidPageSize(17)).toBe(10);

      // Closer to 25
      expect(getValidPageSize(18)).toBe(25);
      expect(getValidPageSize(30)).toBe(25);
      expect(getValidPageSize(37)).toBe(25);

      // Closer to 50
      expect(getValidPageSize(38)).toBe(50);
      expect(getValidPageSize(60)).toBe(50);
      expect(getValidPageSize(75)).toBe(50);

      // Closer to 100
      expect(getValidPageSize(80)).toBe(100);
    });

    it("should return closest allowed page size for values outside the range", () => {
      // Below minimum
      expect(getValidPageSize(1)).toBe(10);
      expect(getValidPageSize(5)).toBe(10);
      expect(getValidPageSize(0)).toBe(10);

      // Above maximum
      expect(getValidPageSize(150)).toBe(100);
      expect(getValidPageSize(999)).toBe(100);
    });

    it("should handle exact midpoint values consistently", () => {
      // Midpoint between 10 and 25 is 17.5
      expect(getValidPageSize(17)).toBe(10); // 17 is closer to 10
      expect(getValidPageSize(18)).toBe(25); // 18 is closer to 25

      // Midpoint between 25 and 50 is 37.5
      expect(getValidPageSize(37)).toBe(25); // 37 is closer to 25
      expect(getValidPageSize(38)).toBe(50); // 38 is closer to 50

      // Midpoint between 50 and 100 is 75
      expect(getValidPageSize(75)).toBe(50); // 75 is closer to 50 than 100
    });
  });

  describe("edge cases", () => {
    it("should handle negative numbers", () => {
      expect(getValidPageSize(-10)).toBe(10);
      expect(getValidPageSize(-1)).toBe(10);
    });

    it("should handle decimal numbers", () => {
      expect(getValidPageSize(10.5)).toBe(10);
      expect(getValidPageSize(24.9)).toBe(25);
      expect(getValidPageSize(50.1)).toBe(50);
    });

    it("should handle zero", () => {
      expect(getValidPageSize(0)).toBe(10);
    });

    it("should handle very large numbers", () => {
      expect(getValidPageSize(999999)).toBe(100);
    });

    it("should handle Infinity", () => {
      expect(getValidPageSize(Infinity)).toBe(10);
    });

    it("should handle NaN", () => {
      expect(getValidPageSize(NaN)).toBe(10);
    });
  });
});
