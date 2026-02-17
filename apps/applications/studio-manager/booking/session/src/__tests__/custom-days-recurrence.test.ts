import { describe, expect, it } from "vitest";

import { fromIsoString } from "@bsport/datetime-manipulation";

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
        startDate: fromIsoString("2025-01-01T10:00:00"),
        endDate: fromIsoString("2025-01-05T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      expect(result).toHaveLength(5);
      expect(result[0].day).toBe(1);
      expect(result[1].day).toBe(2);
      expect(result[2].day).toBe(3);
      expect(result[3].day).toBe(4);
      expect(result[4].day).toBe(5);
    });

    it("should generate dates with 2-day interval (every other day)", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 2,
        startDate: fromIsoString("2025-01-01T10:00:00"),
        endDate: fromIsoString("2025-01-10T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      // Jan 1, 3, 5, 7, 9
      expect(result).toHaveLength(5);
      expect(result[0].day).toBe(1);
      expect(result[1].day).toBe(3);
      expect(result[2].day).toBe(5);
      expect(result[3].day).toBe(7);
      expect(result[4].day).toBe(9);
    });

    it("should generate dates with 7-day interval (weekly)", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 7,
        startDate: fromIsoString("2025-01-01T10:00:00"),
        endDate: fromIsoString("2025-01-31T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      // Jan 1, 8, 15, 22, 29
      expect(result).toHaveLength(5);
      expect(result[0].day).toBe(1);
      expect(result[1].day).toBe(8);
      expect(result[2].day).toBe(15);
      expect(result[3].day).toBe(22);
      expect(result[4].day).toBe(29);
    });
  });

  describe("date range boundaries", () => {
    it("should include start date", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 5,
        startDate: fromIsoString("2025-01-10T10:00:00"),
        endDate: fromIsoString("2025-01-25T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      expect(result[0].day).toBe(10);
    });

    it("should include end date when it matches interval", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 5,
        startDate: fromIsoString("2025-01-01T10:00:00"),
        endDate: fromIsoString("2025-01-11T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      // Jan 1, 6, 11
      expect(result).toHaveLength(3);
      expect(result[2].day).toBe(11);
    });

    it("should exclude dates beyond end date", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 5,
        startDate: fromIsoString("2025-01-01T10:00:00"),
        endDate: fromIsoString("2025-01-10T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      // Jan 1, 6 (Jan 11 is excluded)
      expect(result).toHaveLength(2);
      expect(result[0].day).toBe(1);
      expect(result[1].day).toBe(6);
    });
  });

  describe("timezone handling", () => {
    it("should respect timezone when determining dates", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 1,
        startDate: fromIsoString("2025-01-06T23:00:00Z"), // Midnight CET (Jan 7 in Paris)
        endDate: fromIsoString("2025-01-08T23:00:00Z"), // Midnight CET (Jan 9 in Paris)
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
        startDate: fromIsoString("2025-01-01T00:00:00"),
        endDate: fromIsoString("2025-01-09T00:00:00"),
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
        startDate: fromIsoString("2025-03-07T00:00:00", {
          zone: "Pacific/Chatham",
        }),
        // End: April 13, 2025 in Chatham timezone
        endDate: fromIsoString("2025-04-13T00:00:00", {
          zone: "Pacific/Chatham",
        }),
        timezone: "Pacific/Chatham",
      };

      const result = generateCustomDaysDates(config);

      // Should generate: March 7, 10, 13, 16, 19, 22, 25, 28, 31, April 3, 6 (DST ends), 9, 12
      expect(result).toHaveLength(13);

      // Verify exact dates in Chatham timezone
      const expectedDates = [7, 10, 13, 16, 19, 22, 25, 28, 31, 3, 6, 9, 12]; // Day of month
      const expectedMonths = [3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4]; // 1-based months

      result.forEach((dateTime, index) => {
        const chathamDate = dateTime.setZone("Pacific/Chatham");

        expect(chathamDate.day).toBe(expectedDates[index]);
        expect(chathamDate.month).toBe(expectedMonths[index]); // Luxon months are 1-indexed
      });

      // Verify 3-day spacing is maintained (exactly 3 days apart)
      for (let i = 1; i < result.length; i++) {
        const daysDiff = result[i].diff(result[i - 1], "days").days;
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
        startDate: fromIsoString("2025-01-28T10:00:00"),
        endDate: fromIsoString("2025-02-10T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      // Jan 28, 31, Feb 3, 6, 9
      expect(result).toHaveLength(5);
      expect(result[0].month).toBe(1); // January
      expect(result[0].day).toBe(28);
      expect(result[1].month).toBe(1); // January
      expect(result[1].day).toBe(31);
      expect(result[2].month).toBe(2); // February
      expect(result[2].day).toBe(3);
      expect(result[3].month).toBe(2); // February
      expect(result[3].day).toBe(6);
      expect(result[4].month).toBe(2); // February
      expect(result[4].day).toBe(9);
    });

    it("should handle leap year February", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.DAYS as const,
        interval: 7,
        startDate: fromIsoString("2024-02-15T10:00:00"),
        endDate: fromIsoString("2024-03-07T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomDaysDates(config);

      // Feb 15, 22, 29, Mar 7
      expect(result).toHaveLength(4);
      expect(result[2].day).toBe(29); // Leap day
    });
  });
});
