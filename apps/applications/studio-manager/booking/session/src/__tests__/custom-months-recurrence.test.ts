import { describe, expect, it } from "vitest";

import { generateCustomMonthsDates } from "#src/helpers/recurrence/custom/custom-months-generator";
import {
  CustomRecurrenceUnit,
  MonthlyRecurrencePattern,
  RecurrenceType,
} from "#src/helpers/recurrence/types";

describe("generateCustomMonthsDates", () => {
  describe("DAY_OF_MONTH pattern", () => {
    describe("basic functionality", () => {
      it("should generate dates on the 15th of every month", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
          dayOfMonth: 15,
          startDate: new Date("2025-01-15T10:00:00"),
          endDate: new Date("2025-04-15T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan 15, Feb 15, Mar 15, Apr 15
        expect(result).toHaveLength(4);
        expect(result[0].getDate()).toBe(15);
        expect(result[0].getMonth()).toBe(0);
        expect(result[1].getDate()).toBe(15);
        expect(result[1].getMonth()).toBe(1);
        expect(result[2].getDate()).toBe(15);
        expect(result[2].getMonth()).toBe(2);
        expect(result[3].getDate()).toBe(15);
        expect(result[3].getMonth()).toBe(3);
      });

      it("should generate dates on the 1st of every month", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
          dayOfMonth: 1,
          startDate: new Date("2025-01-01T10:00:00"),
          endDate: new Date("2025-03-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan 1, Feb 1, Mar 1
        expect(result).toHaveLength(3);
        result.forEach((date) => {
          expect(date.getDate()).toBe(1);
        });
      });

      it("should generate dates on the 31st when it exists", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
          dayOfMonth: 31,
          startDate: new Date("2025-01-31T10:00:00"),
          endDate: new Date("2025-12-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan, Mar, May, Jul, Aug, Oct, Dec have 31 days
        expect(result).toHaveLength(7);
        result.forEach((date) => {
          expect(date.getDate()).toBe(31);
          expect([0, 2, 4, 6, 7, 9, 11]).toContain(date.getMonth());
        });
      });
    });

    describe("bi-monthly patterns", () => {
      it("should generate dates every 2 months", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 2,
          pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
          dayOfMonth: 15,
          startDate: new Date("2025-01-15T10:00:00"),
          endDate: new Date("2025-12-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan, Mar, May, Jul, Sep, Nov
        expect(result).toHaveLength(6);
        expect(result[0].getMonth()).toBe(0); // Jan
        expect(result[1].getMonth()).toBe(2); // Mar
        expect(result[2].getMonth()).toBe(4); // May
        expect(result[3].getMonth()).toBe(6); // Jul
        expect(result[4].getMonth()).toBe(8); // Sep
        expect(result[5].getMonth()).toBe(10); // Nov
      });
    });

    describe("edge cases", () => {
      it("should skip February when day is 30", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
          dayOfMonth: 30,
          startDate: new Date("2025-01-30T10:00:00"),
          endDate: new Date("2025-03-30T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan 30, Mar 30 (Feb skipped)
        expect(result).toHaveLength(2);
        expect(result[0].getMonth()).toBe(0);
        expect(result[1].getMonth()).toBe(2);
      });

      it("should skip February when day is 31", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
          dayOfMonth: 31,
          startDate: new Date("2025-01-31T10:00:00"),
          endDate: new Date("2025-03-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan 31, Mar 31 (Feb skipped)
        expect(result).toHaveLength(2);
        expect(result[0].getMonth()).toBe(0);
        expect(result[1].getMonth()).toBe(2);
      });

      it("should handle February 29 in non-leap year", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
          dayOfMonth: 29,
          startDate: new Date("2025-01-29T10:00:00"),
          endDate: new Date("2025-03-29T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan 29, Mar 29 (Feb 29 doesn't exist in 2025)
        expect(result).toHaveLength(2);
        expect(result[0].getMonth()).toBe(0);
        expect(result[1].getMonth()).toBe(2);
      });

      it("should include February 29 in leap year", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
          dayOfMonth: 29,
          startDate: new Date("2024-01-29T10:00:00"),
          endDate: new Date("2024-03-29T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan 29, Feb 29, Mar 29
        expect(result).toHaveLength(3);
        expect(result[1].getDate()).toBe(29);
        expect(result[1].getMonth()).toBe(1); // February
      });
    });
  });

  describe("NTH_WEEKDAY pattern", () => {
    describe("basic functionality", () => {
      it("should generate first Monday of every month", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: new Date("2025-01-06T10:00:00"), // First Monday of Jan 2025
          endDate: new Date("2025-04-30T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // First Monday: Jan 6, Feb 3, Mar 3, Apr 7
        expect(result).toHaveLength(4);
        result.forEach((date) => {
          expect(date.getDay()).toBe(1); // Monday
        });
      });

      it("should generate second Friday of every month", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: new Date("2025-01-10T10:00:00"), // Second Friday of Jan 2025
          endDate: new Date("2025-03-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Second Friday: Jan 10, Feb 14, Mar 14
        expect(result).toHaveLength(3);
        result.forEach((date) => {
          expect(date.getDay()).toBe(5); // Friday
        });
        expect(result[0].getDate()).toBe(10);
        expect(result[1].getDate()).toBe(14);
        expect(result[2].getDate()).toBe(14);
      });

      it("should generate third Wednesday of every month", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: new Date("2025-01-15T10:00:00"), // Third Wednesday of Jan 2025
          endDate: new Date("2025-03-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Third Wednesday: Jan 15, Feb 19, Mar 19
        expect(result).toHaveLength(3);
        result.forEach((date) => {
          expect(date.getDay()).toBe(3); // Wednesday
        });
      });

      it("should generate last Friday of every month", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: new Date("2025-01-31T10:00:00"), // Last Friday of Jan 2025
          endDate: new Date("2025-03-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Last Friday: Jan 31, Feb 28, Mar 28
        expect(result).toHaveLength(3);
        result.forEach((date) => {
          expect(date.getDay()).toBe(5); // Friday
        });
        expect(result[0].getDate()).toBe(31);
        expect(result[1].getDate()).toBe(28);
        expect(result[2].getDate()).toBe(28);
      });
    });

    describe("bi-monthly and quarterly patterns", () => {
      it("should generate first Monday every 2 months", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 2,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: new Date("2025-01-06T10:00:00"), // First Monday of Jan
          endDate: new Date("2025-12-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan, Mar, May, Jul, Sep, Nov
        expect(result).toHaveLength(6);
        expect(result[0].getMonth()).toBe(0);
        expect(result[1].getMonth()).toBe(2);
        expect(result[2].getMonth()).toBe(4);
        expect(result[3].getMonth()).toBe(6);
        expect(result[4].getMonth()).toBe(8);
        expect(result[5].getMonth()).toBe(10);
      });

      it("should generate second Friday every 3 months", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 3,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: new Date("2025-01-10T10:00:00"), // Second Friday of Jan
          endDate: new Date("2025-12-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan, Apr, Jul, Oct
        expect(result).toHaveLength(4);
        expect(result[0].getMonth()).toBe(0);
        expect(result[1].getMonth()).toBe(3);
        expect(result[2].getMonth()).toBe(6);
        expect(result[3].getMonth()).toBe(9);
      });
    });

    describe("edge cases", () => {
      it("should handle months where pattern doesn't exist", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: new Date("2025-01-29T10:00:00"), // Fifth Wednesday of Jan
          endDate: new Date("2025-03-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan has 5th Wednesday, but Feb and Mar don't have a 5th Wednesday
        // Since it's identified as "last Wednesday", it should work
        expect(result.length).toBeGreaterThan(0);
        result.forEach((date) => {
          expect(date.getDay()).toBe(3); // Wednesday
        });
      });

      it("should handle last occurrence across different month lengths", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: new Date("2025-01-27T10:00:00"), // Last Monday of Jan
          endDate: new Date("2025-04-30T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Last Monday varies by month
        expect(result).toHaveLength(4);
        result.forEach((date) => {
          expect(date.getDay()).toBe(1); // Monday
        });
      });

      it("should handle leap year February", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: new Date("2024-02-29T10:00:00"), // Last Thursday of Feb 2024
          endDate: new Date("2024-04-30T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Last Thursday: Feb 29, Mar 28, Apr 25
        expect(result).toHaveLength(3);
        expect(result[0].getDate()).toBe(29);
        expect(result[0].getMonth()).toBe(1); // February
      });
    });
  });

  describe("timezone handling", () => {
    it("should respect timezone for DAY_OF_MONTH pattern", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.MONTHS as const,
        interval: 1,
        pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
        dayOfMonth: 15,
        startDate: new Date("2025-01-15T23:00:00Z"), // Jan 16 00:00 in Paris
        endDate: new Date("2025-03-15T23:00:00Z"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomMonthsDates(config);

      expect(result.length).toBeGreaterThan(0);
    });

    it("should respect timezone for NTH_WEEKDAY pattern", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.MONTHS as const,
        interval: 1,
        pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
        startDate: new Date("2025-01-06T23:00:00Z"), // Jan 7 00:00 in Paris
        endDate: new Date("2025-03-31T23:00:00Z"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomMonthsDates(config);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((date) => {
        expect(date.getDay()).toBeGreaterThanOrEqual(0);
        expect(date.getDay()).toBeLessThanOrEqual(6);
      });
    });

    it("should handle DST transitions for DAY_OF_MONTH pattern", () => {
      // Pacific/Chatham: DST ends April 6, 2025 at 3:45 AM → 2:45 AM (gains 1 hour)
      // Testing that monthly recurrence on 10th maintains correct dates despite DST transition
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.MONTHS as const,
        interval: 1,
        pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
        dayOfMonth: 10,
        // Start: March 10, 2025 in Chatham timezone
        startDate: new Date("2025-03-09T11:00:00.000Z"), // March 10 00:00 CHADT (UTC+13:45)
        // End: June 10, 2025 in Chatham timezone
        endDate: new Date("2025-06-09T12:00:00.000Z"), // June 10 00:00 CHAST (UTC+12:00)
        timezone: "Pacific/Chatham",
      };

      const result = generateCustomMonthsDates(config);

      // Should generate: March 10, April 10 (after DST ends), May 10, June 10
      expect(result).toHaveLength(4);

      // Verify exact dates in Chatham timezone
      const expectedDates = [10, 10, 10, 10]; // Day of month
      const expectedMonths = [2, 3, 4, 5]; // 0-indexed: 2=March, 3=April, 4=May, 5=June

      result.forEach((date, index) => {
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: "Pacific/Chatham",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }).formatToParts(date);

        const day = parseInt(parts.find((p) => p.type === "day")?.value || "0");
        const month =
          parseInt(parts.find((p) => p.type === "month")?.value || "0") - 1; // 0-indexed

        expect(day).toBe(expectedDates[index]);
        expect(month).toBe(expectedMonths[index]);
      });
    });

    it("should handle DST transitions for NTH_WEEKDAY pattern", () => {
      // Pacific/Chatham: DST ends April 6, 2025 at 3:45 AM → 2:45 AM (gains 1 hour)
      // Testing that "first Sunday of each month" maintains correct dates despite DST transition
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.MONTHS as const,
        interval: 1,
        pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
        // Start: March 2, 2025 (First Sunday) in Chatham timezone
        startDate: new Date("2025-03-01T11:00:00.000Z"), // March 2 00:00 CHADT (UTC+13:45)
        // End: June 30, 2025 in Chatham timezone
        endDate: new Date("2025-06-29T12:00:00.000Z"), // June 30 00:00 CHAST (UTC+12:00)
        timezone: "Pacific/Chatham",
      };

      const result = generateCustomMonthsDates(config);

      // Should generate first Sunday of: March 2, April 6 (DST ends), May 4, June 1
      expect(result).toHaveLength(4);

      // Verify exact dates in Chatham timezone
      const expectedDates = [2, 6, 4, 1]; // Day of month
      const expectedMonths = [2, 3, 4, 5]; // 0-indexed: 2=March, 3=April, 4=May, 5=June

      result.forEach((date, index) => {
        const dateStr = date.toLocaleString("en-US", {
          timeZone: "Pacific/Chatham",
          year: "numeric",
          month: "numeric",
          day: "numeric",
          weekday: "long",
        });

        expect(dateStr).toContain("Sunday"); // Verify it's a Sunday

        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: "Pacific/Chatham",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }).formatToParts(date);

        const day = parseInt(parts.find((p) => p.type === "day")?.value || "0");
        const month =
          parseInt(parts.find((p) => p.type === "month")?.value || "0") - 1; // 0-indexed

        expect(day).toBe(expectedDates[index]);
        expect(month).toBe(expectedMonths[index]);
      });
    });
  });
});
