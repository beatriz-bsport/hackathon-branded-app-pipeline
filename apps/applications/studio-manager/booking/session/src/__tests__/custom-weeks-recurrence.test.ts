import { describe, expect, it } from "vitest";

import { fromIsoString } from "@bsport/datetime-manipulation";

import { generateCustomWeeksDates } from "#src/helpers/recurrence/custom/custom-weeks-generator";
import {
  CustomRecurrenceUnit,
  RecurrenceType,
} from "#src/helpers/recurrence/types";

describe("generateCustomWeeksDates", () => {
  describe("basic functionality", () => {
    it("should return empty array when no weekdays are selected", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.WEEKS as const,
        interval: 1,
        weekdays: {
          1: false,
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

      const result = generateCustomWeeksDates(config);

      expect(result).toEqual([]);
    });

    it("should generate dates every week on single weekday", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.WEEKS as const,
        interval: 1,
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

      const result = generateCustomWeeksDates(config);
      // January 2025: Mondays are 6, 13, 20, 27
      expect(result).toHaveLength(4);
      expect(result[0].day).toBe(6);
      expect(result[1].day).toBe(13);
      expect(result[2].day).toBe(20);
      expect(result[3].day).toBe(27);
    });

    it("should generate dates every week on multiple weekdays", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.WEEKS as const,
        interval: 1,
        weekdays: {
          1: true, // Monday
          2: false,
          3: true, // Wednesday
          4: false,
          5: true, // Friday
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-06T10:00:00"), // Monday
        endDate: fromIsoString("2025-01-17T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomWeeksDates(config);

      // Week 1: Mon 6, Wed 8, Fri 10
      // Week 2: Mon 13, Wed 15, Fri 17
      expect(result).toHaveLength(6);
      expect(result[0].day).toBe(6);
      expect(result[1].day).toBe(8);
      expect(result[2].day).toBe(10);
      expect(result[3].day).toBe(13);
      expect(result[4].day).toBe(15);
      expect(result[5].day).toBe(17);
    });
  });

  describe("bi-weekly patterns", () => {
    it("should generate dates every 2 weeks on single weekday", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.WEEKS as const,
        interval: 2,
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
        endDate: fromIsoString("2025-01-31T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomWeeksDates(config);

      // Jan 6, 20 (skips 13, 27)
      expect(result).toHaveLength(2);
      expect(result[0].day).toBe(6);
      expect(result[1].day).toBe(20);
    });

    it("should generate dates every 2 weeks on multiple weekdays", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.WEEKS as const,
        interval: 2,
        weekdays: {
          1: true, // Monday
          2: false,
          3: false,
          4: false,
          5: true, // Friday
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-06T10:00:00"), // Monday
        endDate: fromIsoString("2025-01-31T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomWeeksDates(config);

      // Week starting Jan 6: Mon 6, Fri 10
      // Week starting Jan 20: Mon 20, Fri 24
      expect(result).toHaveLength(4);
      expect(result[0].day).toBe(6);
      expect(result[1].day).toBe(10);
      expect(result[2].day).toBe(20);
      expect(result[3].day).toBe(24);
    });
  });

  describe("date range boundaries", () => {
    it("should include dates in first partial week", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.WEEKS as const,
        interval: 1,
        weekdays: {
          1: true, // Monday
          2: true, // Tuesday
          3: true, // Wednesday
          4: false,
          5: false,
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-07T10:00:00"), // Tuesday
        endDate: fromIsoString("2025-01-15T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomWeeksDates(config);

      // Week 1: Tue 7, Wed 8 (Mon 6 excluded as before start date)
      // Week 2: Mon 13, Tue 14, Wed 15
      expect(result).toHaveLength(5);
      expect(result[0].day).toBe(7);
      expect(result[1].day).toBe(8);
      expect(result[2].day).toBe(13);
    });

    it("should exclude dates in last partial week beyond end date", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.WEEKS as const,
        interval: 1,
        weekdays: {
          1: true, // Monday
          2: true, // Tuesday
          3: true, // Wednesday
          4: false,
          5: false,
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-06T10:00:00"), // Monday
        endDate: fromIsoString("2025-01-14T10:00:00"), // Tuesday
        timezone: "Europe/Paris",
      };

      const result = generateCustomWeeksDates(config);

      // Week 1: Mon 6, Tue 7, Wed 8
      // Week 2: Mon 13, Tue 14 (Wed 15 excluded)
      expect(result).toHaveLength(5);
      expect(result[4].day).toBe(14);
    });

    it("should handle start and end date in same week", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.WEEKS as const,
        interval: 1,
        weekdays: {
          1: true, // Monday
          2: true, // Tuesday
          3: true, // Wednesday
          4: true, // Thursday
          5: true, // Friday
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-06T10:00:00"), // Monday
        endDate: fromIsoString("2025-01-08T10:00:00"), // Wednesday
        timezone: "Europe/Paris",
      };

      const result = generateCustomWeeksDates(config);

      // Mon 6, Tue 7, Wed 8
      expect(result).toHaveLength(3);
      expect(result[0].day).toBe(6);
      expect(result[1].day).toBe(7);
      expect(result[2].day).toBe(8);
    });
  });

  describe("timezone handling", () => {
    it("should respect timezone when determining dates", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.WEEKS as const,
        interval: 1,
        weekdays: {
          1: true, // Monday
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-06T23:00:00Z"), // Jan 7 00:00 in Paris (Tuesday)
        endDate: fromIsoString("2025-01-20T23:00:00Z"), // Jan 21 00:00 in Paris (Tuesday)
        timezone: "Europe/Paris",
      };

      const result = generateCustomWeeksDates(config);

      // Mondays in range: Jan 13, 20
      expect(result).toHaveLength(2);
    });

    it("should handle different timezones consistently", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.WEEKS as const,
        interval: 1,
        weekdays: {
          1: true, // Monday
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-06T00:00:00"),
        endDate: fromIsoString("2025-01-27T23:59:59"),
        timezone: "Asia/Tokyo",
      };

      const result = generateCustomWeeksDates(config);

      // Mondays: Jan 6, 13, 20, 27
      expect(result).toHaveLength(4);
    });

    it("should handle DST transitions correctly", () => {
      // Pacific/Chatham: DST ends April 6, 2025 at 3:45 AM → 2:45 AM (gains 1 hour)
      // Testing that every 2 weeks on Monday and Thursday maintains correct dates despite DST transition
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.WEEKS as const,
        interval: 2,
        weekdays: {
          1: true, // Monday
          2: false,
          3: false,
          4: true, // Thursday
          5: false,
          6: false,
          7: false,
        },
        // Start: March 3, 2025 (Monday) in Chatham timezone
        startDate: fromIsoString("2025-03-03T00:00:00", {
          zone: "Pacific/Chatham",
        }),
        // End: April 17, 2025 (Thursday) in Chatham timezone
        endDate: fromIsoString("2025-04-17T00:00:00", {
          zone: "Pacific/Chatham",
        }),
        timezone: "Pacific/Chatham",
      };

      const result = generateCustomWeeksDates(config);

      // Week 1 (Mar 3): Mon 3, Thu 6
      // Week 3 (Mar 17): Mon 17, Thu 20
      // Week 5 (Mar 31): Mon 31, Thu Apr 3
      // Week 7 (Apr 14): Mon 14, Thu 17 (DST already ended on Apr 6)
      expect(result).toHaveLength(8);

      // Verify exact dates in Chatham timezone
      const expectedDates = [3, 6, 17, 20, 31, 3, 14, 17]; // Day of month
      const expectedMonths = [3, 3, 3, 3, 3, 4, 4, 4]; // 1-indexed: 3=March, 4=April
      const expectedWeekdays = [
        "Monday",
        "Thursday",
        "Monday",
        "Thursday",
        "Monday",
        "Thursday",
        "Monday",
        "Thursday",
      ];

      result.forEach((dateTime, index) => {
        const chathamDate = dateTime.setZone("Pacific/Chatham");

        expect(chathamDate.weekdayLong).toBe(expectedWeekdays[index]); // Verify correct weekday
        expect(chathamDate.day).toBe(expectedDates[index]);
        expect(chathamDate.month).toBe(expectedMonths[index]);
      });
    });
  });

  describe("month boundaries", () => {
    it("should handle dates crossing month boundaries", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.WEEKS as const,
        interval: 1,
        weekdays: {
          1: true, // Monday
          2: false,
          3: false,
          4: false,
          5: true, // Friday
          6: false,
          7: false,
        },
        startDate: fromIsoString("2025-01-27T10:00:00"), // Monday
        endDate: fromIsoString("2025-02-07T10:00:00"), // Friday
        timezone: "Europe/Paris",
      };

      const result = generateCustomWeeksDates(config);

      // Week 1: Mon 27 Jan, Fri 31 Jan
      // Week 2: Mon 3 Feb, Fri 7 Feb
      expect(result).toHaveLength(4);
      expect(result[0].month).toBe(1); // January
      expect(result[0].day).toBe(27);
      expect(result[1].month).toBe(1); // January
      expect(result[1].day).toBe(31);
      expect(result[2].month).toBe(2); // February
      expect(result[2].day).toBe(3);
      expect(result[3].month).toBe(2); // February
      expect(result[3].day).toBe(7);
    });

    it("should handle leap year February", () => {
      const config = {
        type: RecurrenceType.CUSTOM as const,
        unit: CustomRecurrenceUnit.WEEKS as const,
        interval: 1,
        weekdays: {
          1: false,
          2: false,
          3: false,
          4: true, // Thursday
          5: false,
          6: false,
          7: false,
        },
        startDate: fromIsoString("2024-02-22T10:00:00"),
        endDate: fromIsoString("2024-03-07T10:00:00"),
        timezone: "Europe/Paris",
      };

      const result = generateCustomWeeksDates(config);

      // Thu 22 Feb, Thu 29 Feb (leap day), Thu 7 Mar
      expect(result).toHaveLength(3);
      expect(result[1].day).toBe(29);
      expect(result[1].month).toBe(2);
    });
  });
});
