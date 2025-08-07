import { describe, expect, it } from "vitest";

import { stringifyParams } from "#src/index";

describe("stringifyParams", () => {
  describe("basic functionality", () => {
    it("should convert string values to strings", () => {
      const input = { name: "John", city: "Paris" };
      const result = stringifyParams(input);

      expect(result).toEqual({ name: "John", city: "Paris" });
    });

    it("should convert number values to strings", () => {
      const input = { age: 25, count: 100 };
      const result = stringifyParams(input);

      expect(result).toEqual({ age: "25", count: "100" });
    });

    it("should convert boolean values to strings", () => {
      const input = { isActive: true, isComplete: false };
      const result = stringifyParams(input);

      expect(result).toEqual({ isActive: "true", isComplete: "false" });
    });

    it("should handle mixed types", () => {
      const input = { name: "John", age: 25, isActive: true };
      const result = stringifyParams(input);

      expect(result).toEqual({ name: "John", age: "25", isActive: "true" });
    });
  });

  describe("edge cases", () => {
    it("should return empty object for empty input", () => {
      const input = {};
      const result = stringifyParams(input);

      expect(result).toEqual({});
    });

    it("should return empty object for null input", () => {
      // @ts-expect-error - Testing runtime behavior when called with null from JS
      const result = stringifyParams(null);

      expect(result).toEqual({});
    });

    it("should return empty object for undefined input", () => {
      // @ts-expect-error - Testing runtime behavior when called with undefined from JS
      const result = stringifyParams(undefined);

      expect(result).toEqual({});
    });

    it("should handle zero values", () => {
      const input = { count: 0, price: 0.0 };
      const result = stringifyParams(input);

      expect(result).toEqual({ count: "0", price: "0" });
    });

    it("should handle negative numbers", () => {
      const input = { temperature: -10, balance: -25.5 };
      const result = stringifyParams(input);

      expect(result).toEqual({ temperature: "-10", balance: "-25.5" });
    });

    it("should handle special string values", () => {
      const input = { empty: "", space: " ", special: "hello world!" };
      const result = stringifyParams(input);

      expect(result).toEqual({
        empty: "",
        space: " ",
        special: "hello world!",
      });
    });
  });
});
