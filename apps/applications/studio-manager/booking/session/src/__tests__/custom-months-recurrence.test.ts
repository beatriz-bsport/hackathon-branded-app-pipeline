import { describe, expect, it } from "vitest";

import { fromIsoString } from "@bsport/datetime-manipulation";

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
          startDate: fromIsoString("2025-01-15T10:00:00"),
          endDate: fromIsoString("2025-04-15T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan 15, Feb 15, Mar 15, Apr 15
        expect(result).toHaveLength(4);
        expect(result[0].day).toBe(15);
        expect(result[0].month).toBe(1);
        expect(result[1].day).toBe(15);
        expect(result[1].month).toBe(2);
        expect(result[2].day).toBe(15);
        expect(result[2].month).toBe(3);
        expect(result[3].day).toBe(15);
        expect(result[3].month).toBe(4);
      });

      it("should generate dates on the 1st of every month", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
          dayOfMonth: 1,
          startDate: fromIsoString("2025-01-01T10:00:00"),
          endDate: fromIsoString("2025-03-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan 1, Feb 1, Mar 1
        expect(result).toHaveLength(3);
        result.forEach((date) => {
          expect(date.day).toBe(1);
        });
      });

      it("should generate dates on the 31st when it exists", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
          dayOfMonth: 31,
          startDate: fromIsoString("2025-01-31T10:00:00"),
          endDate: fromIsoString("2025-12-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan, Mar, May, Jul, Aug, Oct, Dec have 31 days
        expect(result).toHaveLength(7);
        result.forEach((date) => {
          expect(date.day).toBe(31);
          expect([1, 3, 5, 7, 8, 10, 12]).toContain(date.month);
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
          startDate: fromIsoString("2025-01-15T10:00:00"),
          endDate: fromIsoString("2025-12-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan, Mar, May, Jul, Sep, Nov
        expect(result).toHaveLength(6);
        expect(result[0].month).toBe(1); // Jan
        expect(result[1].month).toBe(3); // Mar
        expect(result[2].month).toBe(5); // May
        expect(result[3].month).toBe(7); // Jul
        expect(result[4].month).toBe(9); // Sep
        expect(result[5].month).toBe(11); // Nov
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
          startDate: fromIsoString("2025-01-30T10:00:00"),
          endDate: fromIsoString("2025-03-30T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan 30, Mar 30 (Feb skipped)
        expect(result).toHaveLength(2);
        expect(result[0].month).toBe(1);
        expect(result[1].month).toBe(3);
      });

      it("should skip February when day is 31", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
          dayOfMonth: 31,
          startDate: fromIsoString("2025-01-31T10:00:00"),
          endDate: fromIsoString("2025-03-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan 31, Mar 31 (Feb skipped)
        expect(result).toHaveLength(2);
        expect(result[0].month).toBe(1);
        expect(result[1].month).toBe(3);
      });

      it("should handle February 29 in non-leap year", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
          dayOfMonth: 29,
          startDate: fromIsoString("2025-01-29T10:00:00"),
          endDate: fromIsoString("2025-03-29T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan 29, Mar 29 (Feb 29 doesn't exist in 2025)
        expect(result).toHaveLength(2);
        expect(result[0].month).toBe(1);
        expect(result[1].month).toBe(3);
      });

      it("should include February 29 in leap year", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
          dayOfMonth: 29,
          startDate: fromIsoString("2024-01-29T10:00:00"),
          endDate: fromIsoString("2024-03-29T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan 29, Feb 29, Mar 29
        expect(result).toHaveLength(3);
        expect(result[1].day).toBe(29);
        expect(result[1].month).toBe(2); // February
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
          startDate: fromIsoString("2025-01-06T10:00:00"), // First Monday of Jan 2025
          endDate: fromIsoString("2025-04-30T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // First Monday: Jan 6, Feb 3, Mar 3, Apr 7
        expect(result).toHaveLength(4);
        result.forEach((date) => {
          expect(date.weekday).toBe(1); // Monday
        });
      });

      it("should generate second Friday of every month", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: fromIsoString("2025-01-10T10:00:00"), // Second Friday of Jan 2025
          endDate: fromIsoString("2025-03-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Second Friday: Jan 10, Feb 14, Mar 14
        expect(result).toHaveLength(3);
        result.forEach((date) => {
          expect(date.weekday).toBe(5); // Friday
        });
        expect(result[0].day).toBe(10);
        expect(result[1].day).toBe(14);
        expect(result[2].day).toBe(14);
      });

      it("should generate third Wednesday of every month", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: fromIsoString("2025-01-15T10:00:00"), // Third Wednesday of Jan 2025
          endDate: fromIsoString("2025-03-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Third Wednesday: Jan 15, Feb 19, Mar 19
        expect(result).toHaveLength(3);
        result.forEach((date) => {
          expect(date.weekday).toBe(3); // Wednesday
        });
      });

      it("should generate last Friday of every month", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: fromIsoString("2025-01-31T10:00:00"), // Last Friday of Jan 2025
          endDate: fromIsoString("2025-03-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Last Friday: Jan 31, Feb 28, Mar 28
        expect(result).toHaveLength(3);
        result.forEach((date) => {
          expect(date.weekday).toBe(5); // Friday
        });
        expect(result[0].day).toBe(31);
        expect(result[1].day).toBe(28);
        expect(result[2].day).toBe(28);
      });
    });

    describe("bi-monthly and quarterly patterns", () => {
      it("should generate first Monday every 2 months", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 2,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: fromIsoString("2025-01-06T10:00:00"), // First Monday of Jan
          endDate: fromIsoString("2025-12-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan, Mar, May, Jul, Sep, Nov
        expect(result).toHaveLength(6);
        expect(result[0].month).toBe(1);
        expect(result[1].month).toBe(3);
        expect(result[2].month).toBe(5);
        expect(result[3].month).toBe(7);
        expect(result[4].month).toBe(9);
        expect(result[5].month).toBe(11);
      });

      it("should generate second Friday every 3 months", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 3,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: fromIsoString("2025-01-10T10:00:00"), // Second Friday of Jan
          endDate: fromIsoString("2025-12-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan, Apr, Jul, Oct
        expect(result).toHaveLength(4);
        expect(result[0].month).toBe(1);
        expect(result[1].month).toBe(4);
        expect(result[2].month).toBe(7);
        expect(result[3].month).toBe(10);
      });
    });

    describe("edge cases", () => {
      it("should handle months where pattern doesn't exist", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: fromIsoString("2025-01-29T10:00:00"), // Fifth Wednesday of Jan
          endDate: fromIsoString("2025-03-31T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Jan has 5th Wednesday, but Feb and Mar don't have a 5th Wednesday
        // Since it's identified as "last Wednesday", it should work
        expect(result.length).toBeGreaterThan(0);
        result.forEach((date) => {
          expect(date.weekday).toBe(3); // Wednesday
        });
      });

      it("should handle last occurrence across different month lengths", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: fromIsoString("2025-01-27T10:00:00"), // Last Monday of Jan
          endDate: fromIsoString("2025-04-30T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Last Monday varies by month
        expect(result).toHaveLength(4);
        result.forEach((date) => {
          expect(date.weekday).toBe(1); // Monday
        });
      });

      it("should handle leap year February", () => {
        const config = {
          type: RecurrenceType.CUSTOM as const,
          unit: CustomRecurrenceUnit.MONTHS as const,
          interval: 1,
          pattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
          startDate: fromIsoString("2024-02-29T10:00:00"), // Last Thursday of Feb 2024
          endDate: fromIsoString("2024-04-30T10:00:00"),
          timezone: "Europe/Paris",
        };

        const result = generateCustomMonthsDates(config);

        // Last Thursday: Feb 29, Mar 28, Apr 25
        expect(result).toHaveLength(3);
        expect(result[0].day).toBe(29);
        expect(result[0].month).toBe(2); // February
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
        startDate: fromIsoString("2025-01-15T23:00:00Z"), // Jan 16 00:00 in Paris
        endDate: fromIsoString("2025-03-15T23:00:00Z"),
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
        startDate: fromIsoString("2025-01-06T23:00:00Z"), // Jan 7 00:00 in Paris
        endDate: fromIsoString("2025-03-31T23:00:00Z"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomMonthsDates(config);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((date) => {
        expect(date.weekday).toBeGreaterThanOrEqual(0);
        expect(date.weekday).toBeLessThanOrEqual(6);
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
        startDate: fromIsoString("2025-03-10T00:00:00", {
          zone: "Pacific/Chatham",
        }),
        // End: June 10, 2025 in Chatham timezone
        endDate: fromIsoString("2025-06-10T00:00:00", {
          zone: "Pacific/Chatham",
        }),
        timezone: "Pacific/Chatham",
      };

      const result = generateCustomMonthsDates(config);

      // Should generate: March 10, April 10 (after DST ends), May 10, June 10
      expect(result).toHaveLength(4);

      // Verify exact dates in Chatham timezone
      const expectedDates = [10, 10, 10, 10]; // Day of month
      const expectedMonths = [3, 4, 5, 6]; // 1-indexed: 3=March, 4=April, 5=May, 6=June

      result.forEach((dateTime, index) => {
        const chathamDate = dateTime.setZone("Pacific/Chatham");

        expect(chathamDate.day).toBe(expectedDates[index]);
        expect(chathamDate.month).toBe(expectedMonths[index]); // Luxon months are 1-indexed
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
        startDate: fromIsoString("2025-03-02T00:00:00", {
          zone: "Pacific/Chatham",
        }),
        // End: June 30, 2025 in Chatham timezone
        endDate: fromIsoString("2025-06-30T00:00:00", {
          zone: "Pacific/Chatham",
        }),
        timezone: "Pacific/Chatham",
      };

      const result = generateCustomMonthsDates(config);

      // Should generate first Sunday of: March 2, April 6 (DST ends), May 4, June 1
      expect(result).toHaveLength(4);

      // Verify exact dates in Chatham timezone
      const expectedDates = [2, 6, 4, 1]; // Day of month
      const expectedMonths = [3, 4, 5, 6]; // 1-indexed: 3=March, 4=April, 5=May, 6=June

      result.forEach((dateTime, index) => {
        const chathamDate = dateTime.setZone("Pacific/Chatham");

        expect(chathamDate.day).toBe(expectedDates[index]);
        expect(chathamDate.month).toBe(expectedMonths[index]); // Luxon months are 1-indexed
      });
    });
  });
});
