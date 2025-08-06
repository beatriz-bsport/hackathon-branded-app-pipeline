import { describe, expect, it } from "vitest";

import { getNumberSearchParam } from "#src/index";

describe("getNumberSearchParam", () => {
  describe("valid number extraction", () => {
    it("should return number when valid string number is provided", () => {
      const searchParams = new URLSearchParams("page=5");
      const result = getNumberSearchParam({
        searchParams,
        key: "page",
        defaultValue: 1,
      });

      expect(result).toBe(5);
    });

    it("should return number when valid decimal string is provided", () => {
      const searchParams = new URLSearchParams("price=19.99");
      const result = getNumberSearchParam({
        searchParams,
        key: "price",
        defaultValue: 0,
      });

      expect(result).toBe(19.99);
    });

    it("should return number when negative string number is provided", () => {
      const searchParams = new URLSearchParams("temperature=-10");
      const result = getNumberSearchParam({
        searchParams,
        key: "temperature",
        defaultValue: 0,
      });

      expect(result).toBe(-10);
    });

    it("should return number when zero string is provided", () => {
      const searchParams = new URLSearchParams("count=0");
      const result = getNumberSearchParam({
        searchParams,
        key: "count",
        defaultValue: 5,
      });

      expect(result).toBe(0);
    });
  });

  describe("fallback to default value", () => {
    it("should return default value when key does not exist", () => {
      const searchParams = new URLSearchParams("other=value");
      const result = getNumberSearchParam({
        searchParams,
        key: "page",
        defaultValue: 10,
      });

      expect(result).toBe(10);
    });

    it("should return default value when param value is null", () => {
      const searchParams = new URLSearchParams();
      const result = getNumberSearchParam({
        searchParams,
        key: "page",
        defaultValue: 15,
      });

      expect(result).toBe(15);
    });

    it("should return default value when param value is empty string", () => {
      const searchParams = new URLSearchParams("page=");
      const result = getNumberSearchParam({
        searchParams,
        key: "page",
        defaultValue: 20,
      });

      expect(result).toBe(20);
    });

    it("should return default value when param value is not a valid number", () => {
      const searchParams = new URLSearchParams("page=abc");
      const result = getNumberSearchParam({
        searchParams,
        key: "page",
        defaultValue: 25,
      });

      expect(result).toBe(25);
    });

    it("should return default value when param value is NaN", () => {
      const searchParams = new URLSearchParams("page=NaN");
      const result = getNumberSearchParam({
        searchParams,
        key: "page",
        defaultValue: 30,
      });

      expect(result).toBe(30);
    });
  });

  describe("edge cases", () => {
    it("should handle whitespace around numbers", () => {
      const searchParams = new URLSearchParams("page= 5 ");
      const result = getNumberSearchParam({
        searchParams,
        key: "page",
        defaultValue: 1,
      });

      expect(result).toBe(5);
    });

    it("should handle scientific notation", () => {
      const searchParams = new URLSearchParams("value=1e2");
      const result = getNumberSearchParam({
        searchParams,
        key: "value",
        defaultValue: 0,
      });

      expect(result).toBe(100);
    });

    it("should handle negative zero", () => {
      const searchParams = new URLSearchParams("value=-0");
      const result = getNumberSearchParam({
        searchParams,
        key: "value",
        defaultValue: 1,
      });

      expect(result).toBe(-0);
    });

    it("should handle different default value types", () => {
      const searchParams = new URLSearchParams("page=invalid");
      const result = getNumberSearchParam({
        searchParams,
        key: "page",
        defaultValue: 0.5,
      });

      expect(result).toBe(0.5);
    });
  });
});
