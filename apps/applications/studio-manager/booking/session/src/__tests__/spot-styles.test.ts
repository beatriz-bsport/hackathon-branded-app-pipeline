import { describe, expect, it } from "vitest";

import { resolveSpotState } from "#src/components/spot-selector/spot-canvas/spot-styles";

describe("resolveSpotState", () => {
  it("returns 'free' when nothing is set", () => {
    expect(
      resolveSpotState({ selected: false, isCurrent: false, taken: false }),
    ).toBe("free");
  });

  it("returns 'taken' when only taken is set", () => {
    expect(
      resolveSpotState({ selected: false, isCurrent: false, taken: true }),
    ).toBe("taken");
  });

  it("returns 'current' when only isCurrent is set", () => {
    expect(
      resolveSpotState({ selected: false, isCurrent: true, taken: false }),
    ).toBe("current");
  });

  it("returns 'selected' when only selected is set", () => {
    expect(
      resolveSpotState({ selected: true, isCurrent: false, taken: false }),
    ).toBe("selected");
  });

  it("prefers 'current' over 'taken' (the participant's own spot is highlighted, not faded)", () => {
    expect(
      resolveSpotState({ selected: false, isCurrent: true, taken: true }),
    ).toBe("current");
  });

  it("prefers 'selected' over 'current' (pending choice supersedes existing spot)", () => {
    expect(
      resolveSpotState({ selected: true, isCurrent: true, taken: false }),
    ).toBe("selected");
  });

  it("'selected' wins when all three flags are set", () => {
    expect(
      resolveSpotState({ selected: true, isCurrent: true, taken: true }),
    ).toBe("selected");
  });
});
