import { describe, expect, it } from "vitest";

import { computeDayOccupancyRate } from "#src/components/SessionList/compute-day-occupancy-rate";

const session = (
  available: boolean,
  effectif: number,
  nb_bookings: number,
) => ({ available, effectif, nb_bookings });

describe("computeDayOccupancyRate", () => {
  it("excludes cancelled (unavailable) sessions from both capacity and bookings", () => {
    // 1 active (5/10) + 1 cancelled (0/10).
    // Naive over all sessions: 5 / 20 = 25%. Active only: 5 / 10 = 50%.
    const rate = computeDayOccupancyRate([
      session(true, 10, 5),
      session(false, 10, 0),
    ]);

    expect(rate).toBe(50);
  });

  it("matches the ticket scenario where excluding cancelled raises the rate", () => {
    // 10 active sessions, 10 capacity each, ~77% filled, plus 2 empty cancelled.
    const active = Array.from({ length: 10 }, () => session(true, 10, 77 / 10));
    const cancelled = [session(false, 10, 0), session(false, 10, 0)];

    expect(computeDayOccupancyRate([...active, ...cancelled])).toBe(77);
  });

  it("rounds to the nearest whole percent", () => {
    // 1 / 3 = 33.33% -> 33.
    expect(computeDayOccupancyRate([session(true, 3, 1)])).toBe(33);
  });

  it("returns 0 when there is no active capacity", () => {
    expect(computeDayOccupancyRate([])).toBe(0);
    expect(computeDayOccupancyRate([session(false, 10, 5)])).toBe(0);
    expect(computeDayOccupancyRate([session(true, 0, 0)])).toBe(0);
  });
});
