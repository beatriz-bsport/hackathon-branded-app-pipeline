import { describe, expect, it } from "vitest";

import { formatClockTimeFromParts } from "../useFormatDatetime";

describe("formatClockTimeFromParts", () => {
  it("renders a 24-hour, zero-padded time for a 24-hour locale", () => {
    expect(formatClockTimeFromParts(14, 5, { locale: "en-GB" })).toBe("14:05");
  });

  it("zero-pads both the hour and the minute", () => {
    expect(formatClockTimeFromParts(9, 0, { locale: "en-GB" })).toBe("09:00");
  });

  it("renders a 12-hour time with meridiem for a 12-hour locale", () => {
    expect(formatClockTimeFromParts(14, 5, { locale: "en-US" })).toBe(
      "2:05 PM",
    );
  });

  it("defaults to the en-US (12-hour) locale when none is given", () => {
    expect(formatClockTimeFromParts(14, 5)).toBe("2:05 PM");
  });
});
