import { beforeEach, describe, expect, it } from "vitest";

import {
  BSPORT_REQUEST_FROM_HEADER_STORAGE_KEY,
  BSPORT_REQUEST_FROM_HEADER_VALUES,
  getBsportRequestFrom,
  removeBsportRequestFrom,
  setBsportRequestFrom,
} from "#src/index";

describe("request from header", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe("Constants", () => {
    it("should export correct sessionStorage key", () => {
      expect(BSPORT_REQUEST_FROM_HEADER_STORAGE_KEY).toBe(
        "bsport-request-from",
      );
    });
  });

  describe("setBsportRequestFrom", () => {
    it("should store value in sessionStorage", () => {
      const value = BSPORT_REQUEST_FROM_HEADER_VALUES.backoffice;
      setBsportRequestFrom(value);

      expect(
        sessionStorage.getItem(BSPORT_REQUEST_FROM_HEADER_STORAGE_KEY),
      ).toBe(value);
    });

    it("should overwrite existing value", () => {
      const firstValue = BSPORT_REQUEST_FROM_HEADER_VALUES.backoffice;
      const secondValue = BSPORT_REQUEST_FROM_HEADER_VALUES.bridge;

      setBsportRequestFrom(firstValue);
      expect(
        sessionStorage.getItem(BSPORT_REQUEST_FROM_HEADER_STORAGE_KEY),
      ).toBe(firstValue);

      setBsportRequestFrom(secondValue);
      expect(
        sessionStorage.getItem(BSPORT_REQUEST_FROM_HEADER_STORAGE_KEY),
      ).toBe(secondValue);
    });
  });

  describe("getBsportRequestFrom", () => {
    it("should return value from sessionStorage", () => {
      const value = BSPORT_REQUEST_FROM_HEADER_VALUES.backoffice;

      sessionStorage.setItem(BSPORT_REQUEST_FROM_HEADER_STORAGE_KEY, value);

      expect(getBsportRequestFrom()).toBe(value);
    });

    it("should return null when no value exists", () => {
      expect(getBsportRequestFrom()).toBeNull();
    });
  });

  describe("removeBsportRequestFrom", () => {
    it("should remove value from sessionStorage", () => {
      const value = BSPORT_REQUEST_FROM_HEADER_VALUES.backoffice;

      sessionStorage.setItem(BSPORT_REQUEST_FROM_HEADER_STORAGE_KEY, value);

      removeBsportRequestFrom();

      expect(
        sessionStorage.getItem(BSPORT_REQUEST_FROM_HEADER_STORAGE_KEY),
      ).toBeNull();
    });

    it("should handle removing non-existent value gracefully", () => {
      expect(() => removeBsportRequestFrom()).not.toThrow();
      expect(
        sessionStorage.getItem(BSPORT_REQUEST_FROM_HEADER_STORAGE_KEY),
      ).toBeNull();
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete workflow: set → get → remove", () => {
      const value = BSPORT_REQUEST_FROM_HEADER_VALUES["franchise-backoffice"];

      // Set bsport-request-from
      setBsportRequestFrom(value);
      expect(getBsportRequestFrom()).toBe(value);

      // Remove bsport-request-from
      removeBsportRequestFrom();
      expect(getBsportRequestFrom()).toBeNull();
    });
  });
});
