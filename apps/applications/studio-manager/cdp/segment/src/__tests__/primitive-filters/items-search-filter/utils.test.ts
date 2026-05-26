import { describe, expect, it } from "vitest";

import type { ItemsSearchFilterOption } from "#src/components/primitive-filters/items-search-filter/types";
import {
  filterOptionsByName,
  filterOptionsByQuery,
} from "#src/components/primitive-filters/items-search-filter/utils";

const sample: ItemsSearchFilterOption[] = [
  { id: 1, name: "Alpha", description: "GROUP A" },
  { id: 2, name: "Beta", description: "GROUP B" },
];

describe("filterOptionsByQuery", () => {
  it("returns all options when query is empty", () => {
    expect(filterOptionsByQuery(sample, "  ")).toEqual(sample);
  });

  it("matches name only when includeDescription is false", () => {
    expect(
      filterOptionsByQuery(sample, "group", { includeDescription: false }),
    ).toEqual([]);
  });

  it("matches description when includeDescription is true", () => {
    expect(
      filterOptionsByQuery(sample, "group b", { includeDescription: true }),
    ).toEqual([{ id: 2, name: "Beta", description: "GROUP B" }]);
  });

  it("keeps filterOptionsByName as name-only behavior", () => {
    expect(filterOptionsByName(sample, "group")).toEqual([]);
    expect(filterOptionsByName(sample, "alpha")).toEqual([sample[0]]);
  });
});
