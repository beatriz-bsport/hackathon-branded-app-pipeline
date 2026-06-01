import { describe, expect, it } from "vitest";

import {
  isBookingHourRangeOrderInvalid,
  isInvalidHourRangeTimeInput,
  normalizeBookingHourRangeFormValue,
  normalizeHourRangeTime,
} from "#src/components/filters/shared/booking-hour-range/normalize-booking-hour-range";

const BOOKING_HOUR_RANGE_DEFAULTS = {
  hour: "09:00",
  hourSecond: "18:00",
} as const;

describe("normalizeHourRangeTime", () => {
  it("returns strict HH:mm values unchanged", () => {
    expect(
      normalizeHourRangeTime("09:00", BOOKING_HOUR_RANGE_DEFAULTS.hour),
    ).toBe("09:00");
  });

  it("pads single-digit hour and minute components", () => {
    expect(
      normalizeHourRangeTime("9:5", BOOKING_HOUR_RANGE_DEFAULTS.hour),
    ).toBe("09:05");
  });

  it("strips optional seconds from 24-hour values", () => {
    expect(
      normalizeHourRangeTime(
        "18:30:00",
        BOOKING_HOUR_RANGE_DEFAULTS.hourSecond,
      ),
    ).toBe("18:30");
  });

  it("converts 12-hour values with meridiem suffix", () => {
    expect(
      normalizeHourRangeTime("9:00 AM", BOOKING_HOUR_RANGE_DEFAULTS.hour),
    ).toBe("09:00");
    expect(
      normalizeHourRangeTime("6:30 PM", BOOKING_HOUR_RANGE_DEFAULTS.hourSecond),
    ).toBe("18:30");
  });

  it("returns fallback for invalid values", () => {
    expect(normalizeHourRangeTime("", BOOKING_HOUR_RANGE_DEFAULTS.hour)).toBe(
      BOOKING_HOUR_RANGE_DEFAULTS.hour,
    );
    expect(
      normalizeHourRangeTime("24:00", BOOKING_HOUR_RANGE_DEFAULTS.hour),
    ).toBe(BOOKING_HOUR_RANGE_DEFAULTS.hour);
    expect(
      normalizeHourRangeTime("invalid", BOOKING_HOUR_RANGE_DEFAULTS.hour),
    ).toBe(BOOKING_HOUR_RANGE_DEFAULTS.hour);
  });
});

describe("normalizeBookingHourRangeFormValue", () => {
  it("normalizes both hour fields", () => {
    expect(
      normalizeBookingHourRangeFormValue(
        {
          hour: "9:00:00",
          hourSecond: "6:30 PM",
        },
        BOOKING_HOUR_RANGE_DEFAULTS,
      ),
    ).toEqual({
      hour: "09:00",
      hourSecond: "18:30",
    });
  });
});

describe("isInvalidHourRangeTimeInput", () => {
  it("allows empty values", () => {
    expect(isInvalidHourRangeTimeInput("")).toBe(false);
    expect(isInvalidHourRangeTimeInput("   ")).toBe(false);
    expect(isInvalidHourRangeTimeInput(null)).toBe(false);
  });

  it("allows strict and loosely formatted values", () => {
    expect(isInvalidHourRangeTimeInput("09:00")).toBe(false);
    expect(isInvalidHourRangeTimeInput("9:5")).toBe(false);
    expect(isInvalidHourRangeTimeInput("9:00 AM")).toBe(false);
  });

  it("rejects non-empty values that cannot be parsed", () => {
    expect(isInvalidHourRangeTimeInput("invalid")).toBe(true);
    expect(isInvalidHourRangeTimeInput("24:00")).toBe(true);
  });
});

describe("isBookingHourRangeOrderInvalid", () => {
  it("returns true when start time is after end time", () => {
    expect(isBookingHourRangeOrderInvalid("18:00", "09:00")).toBe(true);
  });

  it("returns false when start time is before or equal to end time", () => {
    expect(isBookingHourRangeOrderInvalid("09:00", "18:00")).toBe(false);
    expect(isBookingHourRangeOrderInvalid("09:00", "09:00")).toBe(false);
  });
});
