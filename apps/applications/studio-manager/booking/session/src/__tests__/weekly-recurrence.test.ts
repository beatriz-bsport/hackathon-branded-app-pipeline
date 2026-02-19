import { describe, expect, it } from "vitest";

import { fromIsoString } from "@bsport/datetime-manipulation";

import { RecurrenceType } from "#src/helpers/recurrence/types";
import { generateWeeklyDates } from "#src/helpers/recurrence/weekly/generator";

describe("generateWeeklyDates", () => {
  describe("basic functionality", () => {
    it("should return empty array when no weekdays are selected", () => {
      const config = {
        type: RecurrenceType.WEEKLY as const,
        weekdays: {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-01"),
        endDate: fromIsoString("2025-01-31"),
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      expect(result).toEqual([]);
    });

    it("should generate dates for a single selected weekday", () => {
      const config = {
        type: RecurrenceType.WEEKLY as const,
        weekdays: {
          1: true, // Monday
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-01T10:00:00"),
        endDate: fromIsoString("2025-01-31T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // January 2025: Mondays are 6, 13, 20, 27
      expect(result).toHaveLength(4);
      expect(result[0].day).toBe(6);
      expect(result[1].day).toBe(13);
      expect(result[2].day).toBe(20);
      expect(result[3].day).toBe(27);
    });

    it("should generate dates for multiple selected weekdays", () => {
      const config = {
        type: RecurrenceType.WEEKLY as const,
        weekdays: {
          1: true, // Monday
          2: false,
          3: true, // Wednesday
          4: false,
          5: false,
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-01T10:00:00"),
        endDate: fromIsoString("2025-01-15T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // Jan 1 = Wed, so: Wed 1, Mon 6, Wed 8, Mon 13, Wed 15
      expect(result).toHaveLength(5);
      expect(result[0].day).toBe(1); // Wednesday
      expect(result[1].day).toBe(6); // Monday
      expect(result[2].day).toBe(8); // Wednesday
      expect(result[3].day).toBe(13); // Monday
      expect(result[4].day).toBe(15); // Wednesday
    });
  });

  describe("start date alignment", () => {
    it("should start from first selected weekday when start date is not selected", () => {
      const config = {
        type: RecurrenceType.WEEKLY as const,
        weekdays: {
          1: true, // Monday
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-01T10:00:00"), // Wednesday
        endDate: fromIsoString("2025-01-20T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // Should skip Jan 1 (Wed) and start from Jan 6 (Mon)
      expect(result).toHaveLength(3);
      expect(result[0].day).toBe(6);
      expect(result[1].day).toBe(13);
      expect(result[2].day).toBe(20);
    });

    it("should include start date when it matches a selected weekday", () => {
      const config = {
        type: RecurrenceType.WEEKLY as const,
        weekdays: {
          1: true, // Monday
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-06T10:00:00"), // Monday
        endDate: fromIsoString("2025-01-20T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // Should include Jan 6 (the start date itself)
      expect(result).toHaveLength(3);
      expect(result[0].day).toBe(6);
      expect(result[1].day).toBe(13);
      expect(result[2].day).toBe(20);
    });
  });

  describe("date range boundaries", () => {
    it("should include end date when it falls on a selected weekday", () => {
      const config = {
        type: RecurrenceType.WEEKLY as const,
        weekdays: {
          1: false,
          2: false,
          3: false,
          4: false,
          5: true, // Friday
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-01T10:00:00"),
        endDate: fromIsoString("2025-01-17T10:00:00"), // Friday
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // Fridays: Jan 3, 10, 17
      expect(result).toHaveLength(3);
      expect(result[2].day).toBe(17); // End date included
    });
  });

  describe("timezone handling", () => {
    it("should respect timezone when determining dates", () => {
      const config = {
        type: RecurrenceType.WEEKLY as const,
        weekdays: {
          1: true, // Monday
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-06T23:00:00Z"), // Monday 18:00 in New York
        endDate: fromIsoString("2025-01-20T23:00:00Z"),
        timezone: "America/New_York",
      };

      const result = generateWeeklyDates(config);

      expect(result).toHaveLength(3);
      // Verify dates in the target timezone (America/New_York)
      // Use Intl.DateTimeFormat to get the date in the target timezone
      expect(result[0].setZone(config.timezone).day).toBe(6);
      expect(result[1].setZone(config.timezone).day).toBe(13);
      expect(result[2].setZone(config.timezone).day).toBe(20);
    });

    it("should handle DST transitions correctly across different timezones", () => {
      // America/Los_Angeles: DST starts March 9, 2025 at 2:00 AM → 3:00 AM (loses 1 hour)
      // Pacific/Chatham: DST ends April 6, 2025 at 3:45 AM → 2:45 AM (gains 1 hour)
      // Testing that weekly recurrence maintains correct dates despite different DST transitions
      const config = {
        type: RecurrenceType.WEEKLY as const,
        weekdays: {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: true, // Sunday
        },
        // Start: March 2, 2025 (Sunday) in Chatham timezone
        startDate: fromIsoString("2025-03-02T00:00:00", {
          zone: "Pacific/Chatham",
        }),
        // End: April 13, 2025 (Sunday) in Chatham timezone
        endDate: fromIsoString("2025-04-13T00:00:00", {
          zone: "Pacific/Chatham",
        }),
        timezone: "Pacific/Chatham", // Company timezone
      };

      const result = generateWeeklyDates(config);

      // Should generate 7 Sundays: March 2, 9, 16, 23, 30, April 6 (DST ends), 13
      expect(result).toHaveLength(7);

      // Verify exact dates in Chatham timezone
      const expectedDates = [2, 9, 16, 23, 30, 6, 13]; // Day of month
      const expectedMonths = [3, 3, 3, 3, 3, 4, 4]; // 1-indexed: 3=March, 4=April

      result.forEach((dateTime, index) => {
        // Convert to Chatham timezone to check the actual calendar date
        const chathamDate = dateTime.setZone("Pacific/Chatham");

        expect(chathamDate.weekdayLong).toBe("Sunday"); // Verify it's a Sunday
        expect(chathamDate.day).toBe(expectedDates[index]);
        expect(chathamDate.month).toBe(expectedMonths[index]);
      });

      // Verify weekly spacing is maintained (7 days apart)
      // if DST handling was broken, dates might be 6.96 or 7.04 days apart instead of exactly 7
      for (let i = 1; i < result.length; i++) {
        const daysDiff = result[i].diff(result[i - 1], "days").days;
        expect(daysDiff).toBe(7);
      }
    });
  });

  describe("long date ranges", () => {
    it("should handle year-long ranges", () => {
      const config = {
        type: RecurrenceType.WEEKLY as const,
        weekdays: {
          1: true, // Monday
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-01T10:00:00"),
        endDate: fromIsoString("2025-12-31T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // 2025 has 52 Mondays
      expect(result).toHaveLength(52);
    });
  });

  describe("edge cases", () => {
    it("should handle leap year February", () => {
      const config = {
        type: RecurrenceType.WEEKLY as const,
        weekdays: {
          1: true, // Monday
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
        },
        startDate: fromIsoString("2024-02-01T10:00:00"), // 2024 is leap year
        endDate: fromIsoString("2024-02-29T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // February 2024 has 4 Mondays (5, 12, 19, 26)
      expect(result).toHaveLength(4);
      expect(result[3].day).toBe(26);
    });

    it("should handle month boundaries correctly", () => {
      const config = {
        type: RecurrenceType.WEEKLY as const,
        weekdays: {
          1: true, // Monday
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-27T10:00:00"), // Last Monday of Jan
        endDate: fromIsoString("2025-02-10T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // Jan 27, Feb 3, Feb 10
      expect(result).toHaveLength(3);
      expect(result[0].month).toBe(1); // January
      expect(result[1].month).toBe(2); // February
      expect(result[2].month).toBe(2); // February
    });
  });
});
