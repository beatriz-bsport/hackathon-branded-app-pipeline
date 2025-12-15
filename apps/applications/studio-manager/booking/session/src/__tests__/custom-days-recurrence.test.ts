import { describe, expect, it } from "vitest";

import { generateCustomDaysDates } from "#src/helpers/recurrence/custom/custom-days-generator";
import {
  CustomRecurrenceUnit,
  RecurrenceType,
} from "#src/helpers/recurrence/types";

describe("generateCustomDaysDates", () => {
  describe("basic functionality", () => {
    it("should generate dates with 1-day interval (every day)", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 1,
        startDate: new Date("2025-01-01T10:00:00"),
        endDate: new Date("2025-01-05T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      expect(result).toHaveLength(5);
      expect(result[0].getDate()).toBe(1);
      expect(result[1].getDate()).toBe(2);
      expect(result[2].getDate()).toBe(3);
      expect(result[3].getDate()).toBe(4);
      expect(result[4].getDate()).toBe(5);
    });

    it("should generate dates with 2-day interval (every other day)", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 2,
        startDate: new Date("2025-01-01T10:00:00"),
        endDate: new Date("2025-01-10T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      // Jan 1, 3, 5, 7, 9
      expect(result).toHaveLength(5);
      expect(result[0].getDate()).toBe(1);
      expect(result[1].getDate()).toBe(3);
      expect(result[2].getDate()).toBe(5);
      expect(result[3].getDate()).toBe(7);
      expect(result[4].getDate()).toBe(9);
    });

    it("should generate dates with 7-day interval (weekly)", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 7,
        startDate: new Date("2025-01-01T10:00:00"),
        endDate: new Date("2025-01-31T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      // Jan 1, 8, 15, 22, 29
      expect(result).toHaveLength(5);
      expect(result[0].getDate()).toBe(1);
      expect(result[1].getDate()).toBe(8);
      expect(result[2].getDate()).toBe(15);
      expect(result[3].getDate()).toBe(22);
      expect(result[4].getDate()).toBe(29);
    });
  });

  describe("date range boundaries", () => {
    it("should include start date", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 5,
        startDate: new Date("2025-01-10T10:00:00"),
        endDate: new Date("2025-01-25T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      expect(result[0].getDate()).toBe(10);
    });

    it("should include end date when it matches interval", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 5,
        startDate: new Date("2025-01-01T10:00:00"),
        endDate: new Date("2025-01-11T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      // Jan 1, 6, 11
      expect(result).toHaveLength(3);
      expect(result[2].getDate()).toBe(11);
    });

    it("should exclude dates beyond end date", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 5,
        startDate: new Date("2025-01-01T10:00:00"),
        endDate: new Date("2025-01-10T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      // Jan 1, 6 (Jan 11 is excluded)
      expect(result).toHaveLength(2);
      expect(result[0].getDate()).toBe(1);
      expect(result[1].getDate()).toBe(6);
    });
  });

  describe("timezone handling", () => {
    it("should respect timezone when determining dates", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 1,
        startDate: new Date("2025-01-06T23:00:00Z"), // Midnight CET (Jan 7 in Paris)
        endDate: new Date("2025-01-08T23:00:00Z"), // Midnight CET (Jan 9 in Paris)
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      // Should be Jan 7, 8, 9 in Paris timezone
      expect(result).toHaveLength(3);
    });

    it("should handle different timezones consistently", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 2,
        startDate: new Date("2025-01-01T00:00:00"),
        endDate: new Date("2025-01-09T00:00:00"),
        timezone: "Asia/Tokyo",
      };

      const result = generateCustomDaysDates(config);

      // Jan 1, 3, 5, 7, 9
      expect(result).toHaveLength(5);
    });

    it("should handle DST transitions correctly", () => {
      // America/Los_Angeles: DST starts March 9, 2025 at 2:00 AM → 3:00 AM (loses 1 hour)
      // Pacific/Chatham: DST ends April 6, 2025 at 3:45 AM → 2:45 AM (gains 1 hour)
      // Testing that every 3 days recurrence maintains correct dates despite DST transitions
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 3,
        // Start: March 7, 2025 in Chatham timezone
        startDate: new Date("2025-03-06T11:00:00.000Z"), // March 7 00:00 CHADT (UTC+13:45)
        // End: April 13, 2025 in Chatham timezone
        endDate: new Date("2025-04-12T11:15:00.000Z"), // April 13 00:00 CHAST (UTC+12:45, after DST ends)
        timezone: "Pacific/Chatham",
      };

      const result = generateCustomDaysDates(config);

      // Should generate: March 7, 10, 13, 16, 19, 22, 25, 28, 31, April 3, 6 (DST ends), 9, 12
      expect(result).toHaveLength(13);

      // Verify exact dates in Chatham timezone
      const expectedDates = [7, 10, 13, 16, 19, 22, 25, 28, 31, 3, 6, 9, 12]; // Day of month
      const expectedMonths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3]; // 0-indexed: 2=March, 3=April

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

      // Verify 3-day spacing is maintained (exactly 3 days apart)
      for (let i = 1; i < result.length; i++) {
        const daysDiff = Math.round(
          (result[i].getTime() - result[i - 1].getTime()) /
            (1000 * 60 * 60 * 24),
        );
        expect(daysDiff).toBe(3);
      }
    });
  });

  describe("month boundaries", () => {
    it("should handle dates crossing month boundaries", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 3,
        startDate: new Date("2025-01-28T10:00:00"),
        endDate: new Date("2025-02-10T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      // Jan 28, 31, Feb 3, 6, 9
      expect(result).toHaveLength(5);
      expect(result[0].getMonth()).toBe(0); // January
      expect(result[0].getDate()).toBe(28);
      expect(result[1].getMonth()).toBe(0); // January
      expect(result[1].getDate()).toBe(31);
      expect(result[2].getMonth()).toBe(1); // February
      expect(result[2].getDate()).toBe(3);
      expect(result[3].getMonth()).toBe(1); // February
      expect(result[3].getDate()).toBe(6);
      expect(result[4].getMonth()).toBe(1); // February
      expect(result[4].getDate()).toBe(9);
    });

    it("should handle leap year February", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 7,
        startDate: new Date("2024-02-15T10:00:00"),
        endDate: new Date("2024-03-07T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      // Feb 15, 22, 29, Mar 7
      expect(result).toHaveLength(4);
      expect(result[2].getDate()).toBe(29); // Leap day
    });
  });
});
