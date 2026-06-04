import { describe, expect, it } from "vitest";

import { getSessionTimeStatus } from "#src/components/session-occurrence-table/get-session-time-status";

const ZONE = "Europe/Paris";
// 2026-05-21T12:00:00+02:00
const NOW = new Date("2026-05-21T10:00:00.000Z");

describe("getSessionTimeStatus", () => {
  it("returns 'cancelled' when not available, regardless of dates", () => {
    expect(
      getSessionTimeStatus({
        dateStart: "2026-05-21T13:00:00+02:00",
        durationMinute: 60,
        available: false,
        timeZone: ZONE,
        now: NOW,
      }),
    ).toBe("cancelled");
  });

  it("returns 'upcoming' when start is in the future", () => {
    expect(
      getSessionTimeStatus({
        dateStart: "2026-05-21T14:00:00+02:00",
        durationMinute: 60,
        available: true,
        timeZone: ZONE,
        now: NOW,
      }),
    ).toBe("upcoming");
  });

  it("returns 'ongoing' when now is between start and end", () => {
    expect(
      getSessionTimeStatus({
        dateStart: "2026-05-21T11:30:00+02:00",
        durationMinute: 60,
        available: true,
        timeZone: ZONE,
        now: NOW,
      }),
    ).toBe("ongoing");
  });

  it("returns 'past' when end is before now", () => {
    expect(
      getSessionTimeStatus({
        dateStart: "2026-05-21T09:00:00+02:00",
        durationMinute: 60,
        available: true,
        timeZone: ZONE,
        now: NOW,
      }),
    ).toBe("past");
  });
});
