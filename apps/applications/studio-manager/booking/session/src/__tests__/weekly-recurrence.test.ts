import { describe, expect, it } from "vitest";

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
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-31"),
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
        startDate: new Date("2025-01-01T10:00:00"),
        endDate: new Date("2025-01-31T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // January 2025: Mondays are 6, 13, 20, 27
      expect(result).toHaveLength(4);
      expect(result[0].getDate()).toBe(6);
      expect(result[1].getDate()).toBe(13);
      expect(result[2].getDate()).toBe(20);
      expect(result[3].getDate()).toBe(27);
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
        startDate: new Date("2025-01-01T10:00:00"),
        endDate: new Date("2025-01-15T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // Jan 1 = Wed, so: Wed 1, Mon 6, Wed 8, Mon 13, Wed 15
      expect(result).toHaveLength(5);
      expect(result[0].getDate()).toBe(1); // Wednesday
      expect(result[1].getDate()).toBe(6); // Monday
      expect(result[2].getDate()).toBe(8); // Wednesday
      expect(result[3].getDate()).toBe(13); // Monday
      expect(result[4].getDate()).toBe(15); // Wednesday
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
        startDate: new Date("2025-01-01T10:00:00"), // Wednesday
        endDate: new Date("2025-01-20T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // Should skip Jan 1 (Wed) and start from Jan 6 (Mon)
      expect(result).toHaveLength(3);
      expect(result[0].getDate()).toBe(6);
      expect(result[1].getDate()).toBe(13);
      expect(result[2].getDate()).toBe(20);
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
        startDate: new Date("2025-01-06T10:00:00"), // Monday
        endDate: new Date("2025-01-20T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // Should include Jan 6 (the start date itself)
      expect(result).toHaveLength(3);
      expect(result[0].getDate()).toBe(6);
      expect(result[1].getDate()).toBe(13);
      expect(result[2].getDate()).toBe(20);
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
        startDate: new Date("2025-01-01T10:00:00"),
        endDate: new Date("2025-01-17T10:00:00"), // Friday
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // Fridays: Jan 3, 10, 17
      expect(result).toHaveLength(3);
      expect(result[2].getDate()).toBe(17); // End date included
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
        startDate: new Date("2025-01-06T23:00:00Z"), // Monday 18:00 in New York
        endDate: new Date("2025-01-20T23:00:00Z"),
        timezone: "America/New_York",
      };

      const result = generateWeeklyDates(config);

      expect(result).toHaveLength(3);
      // Verify exact dates (Mondays: Jan 6, 13, 20)
      expect(result[0].getDate()).toBe(6);
      expect(result[1].getDate()).toBe(13);
      expect(result[2].getDate()).toBe(20);
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
        startDate: new Date("2025-03-01T11:00:00.000Z"), // March 2 00:00 CHADT (UTC+13:45)
        // End: April 13, 2025 (Sunday) in Chatham timezone
        endDate: new Date("2025-04-12T11:15:00.000Z"), // April 13 00:00 CHAST (UTC+12:45, after DST ends)
        timezone: "Pacific/Chatham", // Company timezone
      };

      const result = generateWeeklyDates(config);

      // Should generate 7 Sundays: March 2, 9, 16, 23, 30, April 6 (DST ends), 13
      expect(result).toHaveLength(7);

      // Verify exact dates in Chatham timezone
      const expectedDates = [2, 9, 16, 23, 30, 6, 13]; // Day of month
      const expectedMonths = [2, 2, 2, 2, 2, 3, 3]; // 0-indexed: 2=March, 3=April

      result.forEach((date, index) => {
        // Convert to Chatham timezone to check the actual calendar date
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

      // Verify weekly spacing is maintained (7 days apart)
      // if DST handling was broken, dates might be 6.96 or 7.04 days apart instead of exactly 7
      for (let i = 1; i < result.length; i++) {
        const daysDiff = Math.round(
          (result[i].getTime() - result[i - 1].getTime()) /
            (1000 * 60 * 60 * 24),
        );
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
        startDate: new Date("2025-01-01T10:00:00"),
        endDate: new Date("2025-12-31T10:00:00"),
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
        startDate: new Date("2024-02-01T10:00:00"), // 2024 is leap year
        endDate: new Date("2024-02-29T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // February 2024 has 4 Mondays (5, 12, 19, 26)
      expect(result).toHaveLength(4);
      expect(result[3].getDate()).toBe(26);
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
        startDate: new Date("2025-01-27T10:00:00"), // Last Monday of Jan
        endDate: new Date("2025-02-10T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateWeeklyDates(config);

      // Jan 27, Feb 3, Feb 10
      expect(result).toHaveLength(3);
      expect(result[0].getMonth()).toBe(0); // January
      expect(result[1].getMonth()).toBe(1); // February
      expect(result[2].getMonth()).toBe(1); // February
    });
  });
});
