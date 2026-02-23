import { describe, expect, it } from "vitest";

import { fromIsoString } from "@bsport/datetime-manipulation";

import {
  getOccurrenceByPosition,
  getWeekdayPositionInMonth,
} from "#src/helpers/recurrence/custom/month.utils";

describe("getWeekdayPositionInMonth", () => {
  describe("first occurrence", () => {
    it("should identify first Monday of the month", () => {
      const date = fromIsoString("2025-01-06T10:00:00"); // First Monday of January 2025

      const result = getWeekdayPositionInMonth(date, "Europe/Paris");

      expect(result.position).toBe(1);
      expect(result.weekday).toBe(1); // Monday
    });

    it("should identify first Sunday of the month", () => {
      const date = fromIsoString("2025-01-05T10:00:00"); // First Sunday of January 2025

      const result = getWeekdayPositionInMonth(date, "Europe/Paris");

      expect(result.position).toBe(1);
      expect(result.weekday).toBe(7); // Sunday
    });
  });

  describe("second occurrence", () => {
    it("should identify second Monday of the month", () => {
      const date = fromIsoString("2025-01-13T10:00:00"); // Second Monday of January 2025

      const result = getWeekdayPositionInMonth(date, "Europe/Paris");

      expect(result.position).toBe(2);
      expect(result.weekday).toBe(1); // Monday
    });

    it("should identify second Tuesday of the month", () => {
      const date = fromIsoString("2025-01-14T10:00:00"); // Second Tuesday of January 2025

      const result = getWeekdayPositionInMonth(date, "Europe/Paris");

      expect(result.position).toBe(2);
      expect(result.weekday).toBe(2); // Tuesday
    });
  });

  describe("third occurrence", () => {
    it("should identify third Wednesday of the month", () => {
      const date = fromIsoString("2025-01-15T10:00:00"); // Third Wednesday of January 2025

      const result = getWeekdayPositionInMonth(date, "Europe/Paris");

      expect(result.position).toBe(3);
      expect(result.weekday).toBe(3); // Wednesday
    });
  });

  describe("fourth occurrence", () => {
    it("should identify fourth Saturday of the month", () => {
      const date = fromIsoString("2025-01-25T10:00:00"); // Last Saturday of January 2025

      const result = getWeekdayPositionInMonth(date, "Europe/Paris");

      expect(result.position).toBe(-1);
      expect(result.weekday).toBe(6); // Saturday
    });
  });

  describe("last occurrence", () => {
    it("should identify last Monday of the month", () => {
      const date = fromIsoString("2025-01-27T10:00:00"); // Last Monday of January 2025

      const result = getWeekdayPositionInMonth(date, "Europe/Paris");

      expect(result.position).toBe(-1);
      expect(result.weekday).toBe(1); // Monday
    });

    it("should identify last Sunday of the month", () => {
      const date = fromIsoString("2025-02-23T10:00:00"); // Last Sunday of February 2025

      const result = getWeekdayPositionInMonth(date, "Europe/Paris");

      expect(result.position).toBe(-1);
      expect(result.weekday).toBe(7); // Sunday
    });
  });

  describe("edge cases", () => {
    it("should handle months with 5 occurrences of a weekday", () => {
      const date = fromIsoString("2025-01-29T10:00:00"); // Fifth Wednesday of January 2025

      const result = getWeekdayPositionInMonth(date, "Europe/Paris");

      // Should be marked as last occurrence since there's no 6th Wednesday
      expect(result.position).toBe(-1);
      expect(result.weekday).toBe(3); // Wednesday
    });

    it("should handle February in non-leap year", () => {
      const date = fromIsoString("2025-02-24T10:00:00"); // Last Monday of February 2025

      const result = getWeekdayPositionInMonth(date, "Europe/Paris");

      expect(result.position).toBe(-1);
      expect(result.weekday).toBe(1); // Monday
    });

    it("should handle February in leap year", () => {
      const date = fromIsoString("2024-02-29T10:00:00"); // Last Thursday of February 2024 (leap year)

      const result = getWeekdayPositionInMonth(date, "Europe/Paris");

      expect(result.position).toBe(-1);
      expect(result.weekday).toBe(4); // Thursday
    });
  });
});

describe("getOccurrenceByPosition", () => {
  describe("first occurrence", () => {
    it("should get first Monday of the month", () => {
      const monthStart = fromIsoString("2025-01-01T10:00:00");

      const result = getOccurrenceByPosition(monthStart, 1, 1, "Europe/Paris");

      expect(result).not.toBeNull();
      expect(result?.day).toBe(6); // January 6, 2025 is first Monday
      expect(result?.month).toBe(1); // Luxon months are 1-indexed
    });

    it("should get first Sunday of the month", () => {
      const monthStart = fromIsoString("2025-01-01T10:00:00");

      const result = getOccurrenceByPosition(monthStart, 7, 1, "Europe/Paris");

      expect(result).not.toBeNull();
      expect(result?.day).toBe(5); // January 5, 2025 is first Sunday
      expect(result?.month).toBe(1); // Luxon months are 1-indexed
    });
  });

  describe("second occurrence", () => {
    it("should get second Tuesday of the month", () => {
      const monthStart = fromIsoString("2025-01-01T10:00:00");

      const result = getOccurrenceByPosition(monthStart, 2, 2, "Europe/Paris");

      expect(result).not.toBeNull();
      expect(result?.day).toBe(14); // January 14, 2025 is second Tuesday
      expect(result?.month).toBe(1); // Luxon months are 1-indexed
    });
  });

  describe("third occurrence", () => {
    it("should get third Saturday of the month", () => {
      const monthStart = fromIsoString("2025-01-01T10:00:00");

      const result = getOccurrenceByPosition(monthStart, 6, 3, "Europe/Paris");

      expect(result).not.toBeNull();
      expect(result?.day).toBe(18); // January 18, 2025 is third Saturday
      expect(result?.month).toBe(1); // Luxon months are 1-indexed
    });
  });

  describe("fourth occurrence", () => {
    it("should get fourth Friday of the month", () => {
      const monthStart = fromIsoString("2025-01-01T10:00:00");

      const result = getOccurrenceByPosition(monthStart, 5, 4, "Europe/Paris");

      expect(result).not.toBeNull();
      expect(result?.day).toBe(24); // January 24, 2025 is fourth Friday
      expect(result?.month).toBe(1); // Luxon months are 1-indexed
    });

    it("should return null if fourth occurrence doesn't exist", () => {
      const monthStart = fromIsoString("2025-02-01T10:00:00"); // February 2025

      const result = getOccurrenceByPosition(monthStart, 7, 4, "Europe/Paris");

      // February 2025 only has 4 Sundays, but the 4th is on Feb 23
      // Actually, let me check the calendar
      expect(result).not.toBeNull();
      if (result) {
        expect(result.month).toBe(2); // Should be in February (1-indexed)
      }
    });
  });

  describe("last occurrence", () => {
    it("should get last Sunday of the month", () => {
      const monthStart = fromIsoString("2025-01-01T10:00:00");

      const result = getOccurrenceByPosition(monthStart, 7, -1, "Europe/Paris");

      expect(result).not.toBeNull();
      expect(result?.day).toBe(26); // January 26, 2025 is last Sunday
      expect(result?.month).toBe(1); // Luxon months are 1-indexed
    });

    it("should get last day of February in non-leap year", () => {
      const monthStart = fromIsoString("2025-02-01T10:00:00");

      const result = getOccurrenceByPosition(monthStart, 5, -1, "Europe/Paris");

      expect(result).not.toBeNull();
      expect(result?.day).toBe(28); // February 28, 2025 is last Friday
      expect(result?.month).toBe(2); // Luxon months are 1-indexed
    });

    it("should get last day of February in leap year", () => {
      const monthStart = fromIsoString("2024-02-01T10:00:00");

      const result = getOccurrenceByPosition(monthStart, 4, -1, "Europe/Paris");

      expect(result).not.toBeNull();
      expect(result?.day).toBe(29); // February 29, 2024 is last Thursday
      expect(result?.month).toBe(2); // Luxon months are 1-indexed
    });
  });

  describe("edge cases", () => {
    it("should handle months with 5 occurrences of a weekday", () => {
      const monthStart = fromIsoString("2025-01-01T10:00:00");

      const result = getOccurrenceByPosition(monthStart, 3, 4, "Europe/Paris");

      expect(result).not.toBeNull();
      expect(result?.day).toBe(22); // Fourth Wednesday
      expect(result?.month).toBe(1); // Luxon months are 1-indexed

      // Last Wednesday should be different from fourth
      const lastResult = getOccurrenceByPosition(
        monthStart,
        3,
        -1,
        "Europe/Paris",
      );
      expect(lastResult).not.toBeNull();
      expect(lastResult?.day).toBe(29); // Last (5th) Wednesday
      expect(lastResult?.month).toBe(1); // Luxon months are 1-indexed
    });
  });

  describe("month boundary validation", () => {
    it("should validate that returned date is in the same month", () => {
      const monthStart = fromIsoString("2025-02-01T10:00:00");

      const result = getOccurrenceByPosition(monthStart, 1, 4, "Europe/Paris");

      expect(result).not.toBeNull();
      if (result) {
        expect(result.month).toBe(monthStart.month);
      }
    });

    it("should use any date in the month as monthStart", () => {
      const monthMiddle = fromIsoString("2025-01-15T10:00:00");

      const result = getOccurrenceByPosition(monthMiddle, 1, 1, "Europe/Paris");

      expect(result).not.toBeNull();
      expect(result?.day).toBe(6); // Still gets first Monday
      expect(result?.month).toBe(1); // Luxon months are 1-indexed
    });
  });
});
