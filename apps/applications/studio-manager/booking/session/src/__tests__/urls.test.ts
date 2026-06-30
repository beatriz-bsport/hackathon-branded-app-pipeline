import { describe, expect, it, vi } from "vitest";

import {
  resolveBookingsManagementRevampPath,
  resolveSeriesClassesPath,
} from "#src/urls";

vi.mock("@bsport/sm-backbone", () => ({
  makeFeatureFlags: () => ({
    flags: {},
    useFlag: () => false,
  }),
}));

describe("urls", () => {
  it("resolves booking management paths", () => {
    expect(resolveBookingsManagementRevampPath(123)).toBe("/calendar/123");
  });

  it("resolves series classes paths", () => {
    expect(resolveSeriesClassesPath(456)).toBe("/calendar/series/456/classes");
  });
});
