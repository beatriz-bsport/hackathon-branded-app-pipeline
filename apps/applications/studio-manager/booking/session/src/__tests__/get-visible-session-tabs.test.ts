import { describe, expect, it } from "vitest";

import { getVisibleSessionTabs } from "#src/utils/get-visible-session-tabs";

describe("getVisibleSessionTabs", () => {
  it("returns overview + editor when session has no group", () => {
    expect(getVisibleSessionTabs(null)).toEqual(["overview", "editor"]);
  });

  it("returns overview + editor + series when session belongs to a group", () => {
    expect(getVisibleSessionTabs(123)).toEqual([
      "overview",
      "editor",
      "series",
    ]);
  });
});
