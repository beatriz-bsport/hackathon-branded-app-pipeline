import { describe, expect, it } from "vitest";

import { getSanitizedPositiveInteger } from "#src/components/primitive-filters/numeric-comparator-filter/utils";

describe("getSanitizedPositiveInteger", () => {
  it("returns null for empty input", () => {
    expect(getSanitizedPositiveInteger("")).toBeNull();
    expect(getSanitizedPositiveInteger("   ")).toBeNull();
  });

  it("floors positive decimals and rejects negatives via clamp", () => {
    expect(getSanitizedPositiveInteger("3.7")).toBe(3);
    expect(getSanitizedPositiveInteger("-2")).toBe(0);
  });

  it("returns null for NaN and infinity values", () => {
    expect(getSanitizedPositiveInteger("NaN")).toBeNull();
    expect(getSanitizedPositiveInteger("Infinity")).toBeNull();
    expect(getSanitizedPositiveInteger("-Infinity")).toBeNull();
  });
});
