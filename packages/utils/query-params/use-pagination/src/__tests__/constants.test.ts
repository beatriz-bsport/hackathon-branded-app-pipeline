import { describe, expect, it } from "vitest";

import {
  DEFAULT_ALLOWED_PAGE_SIZES,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  PARAMS_PAGE,
  PARAMS_PAGE_SIZE,
} from "#src/constants";

describe("pagination constants", () => {
  describe("default values", () => {
    it("should have correct default page value", () => {
      expect(DEFAULT_PAGE).toBe(1);
    });

    it("should have correct default page size value", () => {
      expect(DEFAULT_PAGE_SIZE).toBe(10);
    });

    it("should have correct allowed page sizes", () => {
      expect(DEFAULT_ALLOWED_PAGE_SIZES).toEqual([10, 25, 50, 100]);
    });
  });

  describe("parameter names", () => {
    it("should have correct page parameter name", () => {
      expect(PARAMS_PAGE).toBe("page");
    });

    it("should have correct page size parameter name", () => {
      expect(PARAMS_PAGE_SIZE).toBe("page_size");
    });
  });
});
