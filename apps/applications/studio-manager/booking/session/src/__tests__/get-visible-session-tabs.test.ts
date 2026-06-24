import { describe, expect, it } from "vitest";

import { getVisibleSessionTabs } from "#src/utils/get-visible-session-tabs";

describe("getVisibleSessionTabs", () => {
  it("returns overview + editor when no group and not recurring", () => {
    expect(getVisibleSessionTabs(null, 1)).toEqual(["overview", "editor"]);
  });

  it("returns overview + editor when session belongs to a group", () => {
    expect(getVisibleSessionTabs(123, 1)).toEqual(["overview", "editor"]);
  });

  it("returns overview + editor + occurrences when not grouped but recurring", () => {
    expect(getVisibleSessionTabs(null, 5)).toEqual([
      "overview",
      "editor",
      "occurrences",
    ]);
  });

  it("returns overview + editor when a grouped session is also recurring", () => {
    expect(getVisibleSessionTabs(123, 5)).toEqual(["overview", "editor"]);
  });
});
