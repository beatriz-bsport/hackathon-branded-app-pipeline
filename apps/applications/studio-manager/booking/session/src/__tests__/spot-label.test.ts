import { describe, expect, it } from "vitest";

import {
  composeLabel,
  truncateLabel,
} from "#src/components/spot-selector/spot-canvas/spot-label";

describe("composeLabel", () => {
  it("uses indexType when it is a non-empty string", () => {
    expect(composeLabel(null, "A1", 5, null)).toBe("A1");
  });

  it("uses indexType when it is a non-zero number", () => {
    expect(composeLabel(null, 7, 5, null)).toBe("7");
  });

  it("falls back to index when indexType is 0", () => {
    expect(composeLabel(null, 0, 5, null)).toBe("5");
  });

  it("falls back to index when indexType is null", () => {
    expect(composeLabel(null, null, 5, null)).toBe("5");
  });

  it("falls back to index when indexType is undefined", () => {
    expect(composeLabel(null, undefined, 5, null)).toBe("5");
  });

  it("falls back to index when indexType is an empty string", () => {
    expect(composeLabel(null, "", 5, null)).toBe("5");
  });

  it("prepends prefix when prefix is set", () => {
    expect(composeLabel("A", 3, 0, null)).toBe("A3");
  });

  it("appends suffix when prefix is empty and suffix is set", () => {
    expect(composeLabel(null, 3, 0, "B")).toBe("3B");
  });

  it("prefers prefix over suffix when both are set (mutually exclusive — legacy parity)", () => {
    expect(composeLabel("A", 3, 0, "B")).toBe("A3");
  });

  it("returns bare core when both prefix and suffix are absent", () => {
    expect(composeLabel(null, "C2", 0, null)).toBe("C2");
    expect(composeLabel(undefined, "C2", 0, undefined)).toBe("C2");
  });
});

describe("truncateLabel", () => {
  it("returns the label unchanged when it is shorter than max", () => {
    expect(truncateLabel("ABC")).toBe("ABC");
  });

  it("returns the label unchanged when it equals max", () => {
    expect(truncateLabel("ABCD")).toBe("ABCD");
  });

  it("truncates and adds an ellipsis when longer than max", () => {
    expect(truncateLabel("ABCDE")).toBe("ABC…");
  });

  it("respects a custom max", () => {
    expect(truncateLabel("ABCDEF", 6)).toBe("ABCDEF");
    expect(truncateLabel("ABCDEFG", 6)).toBe("ABCDE…");
  });
});
