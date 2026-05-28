import { describe, expect, it } from "vitest";

import {
  formatSessionTimeRange,
  getSessionStartEnd,
} from "#src/utils/session-time-range";

const ZONE = "Europe/Paris";

describe("getSessionStartEnd", () => {
  it("derives the end from durationMinute when no dateEnd is given", () => {
    const { start, end } = getSessionStartEnd({
      dateStart: "2026-05-21T09:00:00+02:00",
      durationMinute: 90,
      zone: ZONE,
    });

    expect(end.toMillis() - start.toMillis()).toBe(90 * 60 * 1000);
  });

  it("uses an explicit dateEnd when given", () => {
    const { start, end } = getSessionStartEnd({
      dateStart: "2026-05-21T09:00:00+02:00",
      dateEnd: "2026-05-21T11:30:00+02:00",
      zone: ZONE,
    });

    expect(end.toMillis() - start.toMillis()).toBe(150 * 60 * 1000);
  });

  it("spans multiple days when the duration crosses midnight", () => {
    const { start, end } = getSessionStartEnd({
      dateStart: "2026-05-21T23:00:00+02:00",
      durationMinute: 120,
      zone: ZONE,
    });

    expect(start.toISODate()).not.toBe(end.toISODate());
  });
});

describe("formatSessionTimeRange", () => {
  it("formats a same-day range as 'start - end' in the given locale", () => {
    expect(
      formatSessionTimeRange({
        dateStart: "2026-05-21T09:00:00+02:00",
        durationMinute: 60,
        zone: ZONE,
        locale: "en-US",
      }),
    ).toBe("9:00 AM - 10:00 AM");
  });
});
